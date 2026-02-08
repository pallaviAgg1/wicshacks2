const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

const crowdReportValidation = {
  create: [
    body('report_type')
      .isString()
      .isIn([
        'mud',
        'crowd_dense',
        'obstacle',
        'flooding',
        'uneven_terrain',
        'blocked_path',
        'other',
      ])
      .withMessage('Invalid report type'),
    body('latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90'),
    body('longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180'),
    body('description')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    body('severity')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Severity must be low, medium, or high'),
    handleValidationErrors,
  ],
  update: [
    param('id').isUUID().withMessage('Invalid ID format'),
    body('status')
      .optional()
      .isIn(['active', 'resolved'])
      .withMessage('Status must be active or resolved'),
    body('severity')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Severity must be low, medium, or high'),
    body('upvotes')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Upvotes must be a non-negative integer'),
    body('description')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    handleValidationErrors,
  ],
  getId: [param('id').isUUID().withMessage('Invalid ID format'), handleValidationErrors],
};

const sosRequestValidation = {
  create: [
    body('emergency_type')
      .isString()
      .isIn([
        'medical',
        'panic_attack',
        'dehydration',
        'lost',
        'feeling_unsafe',
        'accessibility_help',
        'other',
      ])
      .withMessage('Invalid emergency type'),
    body('latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90'),
    body('longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180'),
    body('description')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    body('contact_phone')
      .optional()
      .matches(/^[\d\s\-\+\(\)]+$/)
      .withMessage('Invalid phone number format'),
    handleValidationErrors,
  ],
  update: [
    param('id').isUUID().withMessage('Invalid ID format'),
    body('status')
      .optional()
      .isIn(['pending', 'responding', 'resolved'])
      .withMessage('Status must be pending, responding, or resolved'),
    body('description')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    body('contact_phone')
      .optional()
      .matches(/^[\d\s\-\+\(\)]+$/)
      .withMessage('Invalid phone number format'),
    handleValidationErrors,
  ],
  getId: [param('id').isUUID().withMessage('Invalid ID format'), handleValidationErrors],
};

module.exports = {
  crowdReportValidation,
  sosRequestValidation,
  handleValidationErrors,
};
