"use client";

import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  author: "",
  rating: "5",
  review: "",
};

export default function ReviewForm({
  disabled = false,
  reviewToEdit = null,
  onSaved,
  onCancelEdit,
  onSaveReview,
}) {
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const isEditing = Boolean(reviewToEdit);

  useEffect(() => {
    if (!reviewToEdit) {
      setForm(initialForm);
      return;
    }

    setForm({
      title: reviewToEdit.title ?? "",
      author: reviewToEdit.author ?? "",
      rating: String(reviewToEdit.rating ?? 5),
      review: reviewToEdit.review ?? "",
    });
  }, [reviewToEdit]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback(null);

    if (disabled) {
      setFeedback({
        type: "error",
        text: "Firestore setup still needs to be finished before reviews can be saved.",
      });
      return;
    }

    setIsPending(true);

    try {
      await Promise.resolve(
        onSaveReview?.({
          ...form,
          id: reviewToEdit?.id ?? null,
        }),
      );

      setForm(initialForm);
      setFeedback({
        type: "success",
        text: isEditing
          ? `Updated "${form.title}" for the public shelf.`
          : `Saved "${form.title}" to your review shelf.`,
      });
      onSaved?.();
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : `This review could not be ${isEditing ? "updated" : "saved"}.`,
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={updateField}
          placeholder="The Left Hand of Darkness"
          maxLength={120}
          disabled={disabled}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="author">Author</label>
        <input
          id="author"
          name="author"
          value={form.author}
          onChange={updateField}
          placeholder="Ursula K. Le Guin"
          maxLength={120}
          disabled={disabled}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="rating">Rating</label>
        <input
          id="rating"
          name="rating"
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={form.rating}
          onChange={updateField}
          disabled={disabled}
          required
        />
        <p className="field-note">Use a 1.0 to 5.0 scale. The list reorders automatically after every save.</p>
      </div>

      <div className="field">
        <label htmlFor="review">Review</label>
        <textarea
          id="review"
          name="review"
          value={form.review}
          onChange={updateField}
          placeholder="What made this book worth remembering?"
          maxLength={4000}
          disabled={disabled}
          required
        />
      </div>

      {feedback ? <p className={`feedback ${feedback.type}`}>{feedback.text}</p> : null}

      <div className="button-row">
        <button className="button" type="submit" disabled={isPending || disabled}>
          {disabled
            ? "Finish Firestore Setup"
            : isPending
              ? isEditing
                ? "Updating review..."
                : "Saving review..."
              : isEditing
                ? "Update Review"
                : "Add Review"}
        </button>
        {isEditing ? (
          <button
            className="ghost-button"
            type="button"
            onClick={() => {
              setForm(initialForm);
              setFeedback(null);
              onCancelEdit?.();
            }}
            disabled={isPending}
          >
            Cancel Edit
          </button>
        ) : null}
        <p className="stack-note">Posts publish straight to Firebase and stay sorted by rating automatically.</p>
      </div>
    </form>
  );
}
