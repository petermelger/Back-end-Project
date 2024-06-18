import { Router } from "express";
import getReviews from "../services/reviews/getReviews.js";
import createReview from "../services/reviews/createReview.js";
import getReviewById from "../services/reviews/getReviewById.js";
import deleteReviewById from "../services/reviews/deleteReviewById.js";
import updateReviewById from "../services/reviews/updateReviewById.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const reviews = await getReviews(res);
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { rating, comment, userId, propertyId } = req.body;

    const newReview = await createReview({
      rating,
      comment,
      userId,
      propertyId,
    });

    if (newReview.error) {
      res.status(400).json({
        message: newReview.error,
      });
    } else {
      res.status(201).json({
        message: "Review successfully added",
        review: newReview,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await getReviewById(id);

    if (!review) {
      res.status(404).json({ message: `Review with id ${id} not found` });
    } else {
      res.status(200).json(review);
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedReview = await deleteReviewById(id);

    if (deletedReview) {
      res.status(200).send({
        message: `Review with id ${id} successfully deleted`,
        review: deletedReview,
      });
    } else {
      res.status(404).json({
        message: `Review with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment, propertyId, userId } = req.body;
    const updatedReview = await updateReviewById(id, {
      rating,
      comment,
      propertyId,
      userId,
    });

    if (updatedReview) {
      res.status(200).send({
        message: `Review with id ${id} successfully updated`,
      });
    } else {
      res.status(404).json({
        message: `Review with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
