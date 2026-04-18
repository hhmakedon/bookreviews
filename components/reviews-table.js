"use client";

function formatDate(value) {
  if (!value) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getReviewFooter(review) {
  const createdLabel = `Posted ${formatDate(review.createdAt)}`;

  if (review.updatedAt && review.updatedAt !== review.createdAt) {
    return `${createdLabel} · Updated ${formatDate(review.updatedAt)}`;
  }

  return createdLabel;
}

export default function ReviewsTable({ reviews, canEdit = false, editingReviewId = null, onEdit }) {
  if (!reviews.length) {
    return (
      <div className="table-shell">
        <div className="empty-state">
          <p>No reviews have been added yet. Your first entry will appear here as soon as you save it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-shell">
      <div className="review-list">
        {reviews.map((review) => (
          <article className="review-card" key={review.id}>
            <div className="review-card-head">
              <div>
                <h3>{review.title}</h3>
                <p className="book-meta">by {review.author}</p>
              </div>
              <div className="rating-pill">
                <strong>{review.rating.toFixed(1)}</strong>
                <span>Rating</span>
              </div>
            </div>

            <p className="review-text">{review.review}</p>
            <div className="review-card-foot">
              <p className="review-footer">{getReviewFooter(review)}</p>
              {canEdit ? (
                <button
                  className={`secondary-button${editingReviewId === review.id ? " active" : ""}`}
                  type="button"
                  onClick={() => onEdit?.(review)}
                >
                  {editingReviewId === review.id ? "Editing" : "Edit Review"}
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
