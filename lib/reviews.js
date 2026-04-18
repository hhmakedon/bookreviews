import { Timestamp } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "@/lib/firebase-admin";
import { hasFirebaseAdminConfig } from "@/lib/config";

const COLLECTION_NAME = "reviews";

function normalizeReviewDocument(document) {
  const data = document.data();

  return {
    id: document.id,
    title: data.title,
    author: data.author,
    rating: Number(data.rating),
    review: data.review,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
    createdBy: data.createdBy ?? null,
  };
}

function normalizeInput(rawReview) {
  const title = String(rawReview?.title ?? "").trim();
  const author = String(rawReview?.author ?? "").trim();
  const review = String(rawReview?.review ?? "").trim();
  const rating = Number(rawReview?.rating);

  if (!title) {
    throw new Error("Please enter a book title.");
  }

  if (!author) {
    throw new Error("Please enter the author name.");
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be a number between 1 and 5.");
  }

  if (!review) {
    throw new Error("Please enter your review.");
  }

  return {
    title: title.slice(0, 120),
    author: author.slice(0, 120),
    rating: Math.round(rating * 10) / 10,
    review: review.slice(0, 4000),
  };
}

function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error ?? "");
}

export function isFirestoreSetupError(error) {
  const message = getErrorMessage(error);

  return (
    message.includes("firestore.googleapis.com") ||
    message.includes("Cloud Firestore API has not been used") ||
    message.includes("The caller does not have permission") ||
    message.includes("7 PERMISSION_DENIED")
  );
}

export function getFirestoreSetupMessage() {
  return "Cloud Firestore is not enabled for project bookreview-13f32 yet. Enable Firestore in Firebase Console, wait a minute, and refresh the page.";
}

export async function listReviews() {
  if (!hasFirebaseAdminConfig()) {
    return [];
  }

  const snapshot = await getFirebaseAdminFirestore()
    .collection(COLLECTION_NAME)
    .orderBy("rating", "desc")
    .get();

  return snapshot.docs
    .map(normalizeReviewDocument)
    .sort((left, right) => {
      const updatedLeft = new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
      const updatedRight = new Date(right.updatedAt ?? right.createdAt ?? 0).getTime();

      return right.rating - left.rating || updatedRight - updatedLeft || left.title.localeCompare(right.title);
    });
}

export async function listReviewsSafely() {
  try {
    const reviews = await listReviews();

    return {
      reviews,
      error: "",
    };
  } catch (error) {
    return {
      reviews: [],
      error: isFirestoreSetupError(error)
        ? getFirestoreSetupMessage()
        : "The review shelf could not be loaded right now. Please refresh and try again.",
    };
  }
}

export async function createReview(rawReview, userId) {
  const review = normalizeInput(rawReview);
  const timestamp = Timestamp.now();
  const reviewReference = await getFirebaseAdminFirestore().collection(COLLECTION_NAME).add({
    ...review,
    createdBy: userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const createdSnapshot = await reviewReference.get();

  return normalizeReviewDocument(createdSnapshot);
}

export async function updateReview(reviewId, rawReview) {
  const normalizedReviewId = String(reviewId ?? "").trim();

  if (!normalizedReviewId) {
    throw new Error("A review id is required to update a post.");
  }

  const review = normalizeInput(rawReview);
  const reviewReference = getFirebaseAdminFirestore().collection(COLLECTION_NAME).doc(normalizedReviewId);
  const existingReview = await reviewReference.get();

  if (!existingReview.exists) {
    throw new Error("That review could not be found.");
  }

  await reviewReference.update({
    ...review,
    updatedAt: Timestamp.now(),
  });

  const updatedSnapshot = await reviewReference.get();

  return normalizeReviewDocument(updatedSnapshot);
}
