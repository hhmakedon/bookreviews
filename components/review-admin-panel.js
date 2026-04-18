"use client";

import { useEffect, useState } from "react";
import ReviewForm from "@/components/review-form";
import ReviewsTable from "@/components/reviews-table";

export default function ReviewAdminPanel({
  authorizedUsername,
  reviews,
  reviewsError,
  onSaveReview,
  isRefreshing = false,
}) {
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    if (editingReviewId && !reviews.some((review) => review.id === editingReviewId)) {
      setEditingReviewId(null);
    }
  }, [editingReviewId, reviews]);

  const reviewToEdit = reviews.find((review) => review.id === editingReviewId) ?? null;

  return (
    <section className="library-panel">
      <div className="panel editor-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Barista's Desk</p>
            <h2>{reviewToEdit ? "Edit today's note" : "Brew a new review"}</h2>
          </div>
          <p className="table-note">
            Signed in as {authorizedUsername}. Only this account can publish or revise posts.
          </p>
        </div>
        {reviewsError ? <p className="feedback error">{reviewsError}</p> : null}
        <ReviewForm
          disabled={Boolean(reviewsError)}
          reviewToEdit={reviewToEdit}
          onSaved={() => setEditingReviewId(null)}
          onCancelEdit={() => setEditingReviewId(null)}
          onSaveReview={onSaveReview}
          isRefreshing={isRefreshing}
        />
      </div>

      <div className="panel shelf-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Open Shelf</p>
            <h2>Public review posts</h2>
          </div>
          <p className="table-note">Visitors can read every review. Makedon can edit any post from here.</p>
        </div>
        {reviewsError ? (
          <div className="empty-state">
            <p>{reviewsError}</p>
          </div>
        ) : (
          <ReviewsTable
            reviews={reviews}
            canEdit
            editingReviewId={editingReviewId}
            onEdit={(review) => setEditingReviewId(review.id)}
          />
        )}
      </div>
    </section>
  );
}
