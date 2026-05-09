const Expert = require('../models/Expert');

const DEFAULT_EXPERT_PASSWORD = '123';

// Get all experts with pagination and filtering
exports.getExperts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const experts = await Expert.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ rating: -1 });

    const total = await Expert.countDocuments(query);

    res.status(200).json({
      success: true,
      experts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching experts',
      error: error.message,
    });
  }
};

// Get expert by ID
exports.getExpertById = async (req, res) => {
  try {
    const { id } = req.params;

    const expert = await Expert.findById(id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }

    res.status(200).json({
      success: true,
      expert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expert',
      error: error.message,
    });
  }
};

/**
 * Expert login (simple, no JWT/session):
 * - Validates expertId exists
 * - Validates provided name matches stored expert.name (case-insensitive)
 * - Validates password === '123'
 */
exports.loginExpert = async (req, res) => {
  try {
    const { expertId, name, password } = req.body;

    if (!expertId || !name || !password) {
      return res.status(400).json({
        success: false,
        message: 'expertId, name and password are required',
      });
    }

    if (password !== DEFAULT_EXPERT_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }

    const storedName = (expert.name || '').trim().toLowerCase();
    const providedName = (name || '').trim().toLowerCase();

    if (!storedName || storedName !== providedName) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    res.status(200).json({
      success: true,
      expert,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error logging in expert',
      error: error.message,
    });
  }
};

// Create new expert (admin)
exports.createExpert = async (req, res) => {
  try {
    const { name, category, experience, rating, bio, hourlyRate, profileImage } = req.body;

    const expert = new Expert({
      name,
      category,
      experience,
      rating,
      bio,
      hourlyRate,
      profileImage,
    });

    await expert.save();

    res.status(201).json({
      success: true,
      message: 'Expert created successfully',
      expert,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating expert',
      error: error.message,
    });
  }
};
