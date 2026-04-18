"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import LoginForm from "@/components/login-form";
import LogoutButton from "@/components/logout-button";
import ReviewAdminPanel from "@/components/review-admin-panel";
import ReviewsTable from "@/components/reviews-table";
import { auth, db } from "@/lib/firebase-client";
import { AUTHORIZED_EMAIL, AUTHORIZED_USERNAME } from "@/lib/site-config";

function sortReviews(reviews) {
  return [...reviews].sort((left, right) => {
    const updatedLeft = new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
    const updatedRight = new Date(right.updatedAt ?? right.createdAt ?? 0).getTime();

    return right.rating - left.rating || updatedRight - updatedLeft || left.title.localeCompare(right.title);
  });
}

function normalizeReviewDocument(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    title: data.title ?? "",
    author: data.author ?? "",
    rating: Number(data.rating ?? 0),
    review: data.review ?? "",
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
  };
}

function getAuthErrorMessage(error) {
  const code = error?.code ?? "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Invalid username or password.";
    case "auth/unauthorized-domain":
      return "This site is not yet listed in Firebase Authentication authorized domains.";
    case "auth/network-request-failed":
      return "Firebase could not be reached. Check your connection and try again.";
    default:
      return error instanceof Error ? error.message : "Login could not be completed right now.";
  }
}

function getFirestoreErrorMessage(error) {
  const code = error?.code ?? "";
  const message = error?.message ?? "";

  if (code === "permission-denied" || message.includes("Missing or insufficient permissions")) {
    return "Firestore permissions are not set up yet. Apply the rules from firestore.rules so the public can read and Makedon can write.";
  }

  if (code === "failed-precondition" || message.includes("The query requires an index")) {
    return "Firestore needs an index for rating-based sorting. Open the Firebase Console index link once to create it.";
  }

  return error instanceof Error ? error.message : "The review shelf could not be loaded right now.";
}

function validateReviewPayload(payload) {
  const title = String(payload?.title ?? "").trim();
  const author = String(payload?.author ?? "").trim();
  const review = String(payload?.review ?? "").trim();
  const rating = Number(payload?.rating);

  if (!title) {
    throw new Error("Please enter a book title.");
  }

  if (!author) {
    throw new Error("Please enter the author.");
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be a number between 1 and 5.");
  }

  if (!review) {
    throw new Error("Please write a review.");
  }

  return {
    title: title.slice(0, 120),
    author: author.slice(0, 120),
    rating: Math.round(rating * 10) / 10,
    review: review.slice(0, 4000),
  };
}

export default function BookReviewApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsError, setReviewsError] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const reviewsQuery = query(collection(db, "reviews"), orderBy("rating", "desc"));
    const unsubscribeReviews = onSnapshot(
      reviewsQuery,
      (reviewsSnapshot) => {
        setReviews(sortReviews(reviewsSnapshot.docs.map(normalizeReviewDocument)));
        setReviewsError("");
      },
      (error) => {
        setReviews([]);
        setReviewsError(getFirestoreErrorMessage(error));
      },
    );

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user?.email === AUTHORIZED_EMAIL ? user : null);
      setIsAuthReady(true);
    });

    return () => {
      unsubscribeReviews();
      unsubscribeAuth();
    };
  }, []);

  const topRating = reviews[0]?.rating ?? null;
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : null;

  async function handleLogin({ username, password }) {
    setAuthError("");

    if (username.trim().toLowerCase() !== AUTHORIZED_USERNAME.toLowerCase()) {
      setAuthError("Invalid username or password.");
      return false;
    }

    try {
      await signInWithEmailAndPassword(auth, AUTHORIZED_EMAIL, password);
      return true;
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
      return false;
    }
  }

  async function handleLogout() {
    await signOut(auth);
  }

  async function handleSaveReview(payload) {
    if (!currentUser) {
      throw new Error("Please log in first.");
    }

    const reviewData = validateReviewPayload(payload);

    try {
      if (payload.id) {
        await updateDoc(doc(db, "reviews", payload.id), {
          ...reviewData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "reviews"), {
          ...reviewData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      throw new Error(getFirestoreErrorMessage(error));
    }
  }

  return (
    <main className="shell">
      <section className="hero-band">
        <div className="hero-copy">
          <h1>Mr. Makedon's Book Reviews</h1>
          <p className="hero-text">Public book reviews by Mr. Makedon.</p>
        </div>

        <div className="hero-side">
          {currentUser ? (
            <section className="panel auth-panel">
              <div className="panel-heading">
                <div>
                  <h2>Welcome back, {AUTHORIZED_USERNAME}</h2>
                </div>
                <LogoutButton onLogout={handleLogout} />
              </div>

              <div className="summary-grid">
                <article className="summary-card">
                  <span className="status-label">Posts on the shelf</span>
                  <strong>{reviews.length}</strong>
                </article>
                <article className="summary-card">
                  <span className="status-label">Top rating</span>
                  <strong>{topRating ? `${topRating.toFixed(1)} / 5` : "No entries yet"}</strong>
                </article>
                <article className="summary-card">
                  <span className="status-label">Average score</span>
                  <strong>{averageRating ? `${averageRating} / 5` : "Waiting for data"}</strong>
                </article>
              </div>
            </section>
          ) : (
            <LoginForm
              authorizedUsername={AUTHORIZED_USERNAME}
              authError={authError}
              onLogin={handleLogin}
              loading={!isAuthReady}
            />
          )}
        </div>
      </section>

      {currentUser ? (
        <ReviewAdminPanel
          authorizedUsername={AUTHORIZED_USERNAME}
          reviews={reviews}
          reviewsError={reviewsError}
          onSaveReview={handleSaveReview}
        />
      ) : (
        <section className="preview-panel panel public-shelf-panel">
          <div className="panel-heading">
            <div>
              <h2>Public Shelf</h2>
            </div>
          </div>
          {reviewsError ? (
            <div className="empty-state">
              <p>{reviewsError}</p>
            </div>
          ) : (
            <ReviewsTable reviews={reviews} />
          )}
        </section>
      )}
    </main>
  );
}
