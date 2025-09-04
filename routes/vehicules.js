const express = require("express");
const db = require("../db");
const router = express.Router();

const promisedb = db.promise();


// Validation middleware
const validateVehicle = (req, res, next) => {
  const { LIB, TONNAGE } = req.body;
  
  if (!LIB || typeof LIB !== 'string' || LIB.trim().length === 0) {
    return res.status(400).json({
      error: 'LIB is required and must be a non-empty string'
    });
  }
  
  if (LIB.length > 100) {
    return res.status(400).json({
      error: 'LIB must be 100 characters or less'
    });
  }
  
  if (TONNAGE !== undefined && (isNaN(TONNAGE) || TONNAGE < 0)) {
    return res.status(400).json({
      error: 'TONNAGE must be a positive number'
    });
  }
  
  next();
};

// Error handler middleware
const handleDatabaseError = (error, res) => {
  console.error('Database error:', error);
  
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Vehicle with this LIB already exists'
    });
  }
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({
      error: 'Vehicule attached to a driver '
    });
  }
  
  return res.status(500).json({
    error: 'Internal server error'
  });
};

// CRUD Routes

// CREATE - Add a new vehicle
router.post('/vehicules', validateVehicle, async (req, res) => {
  try {
    const { LIB, TONNAGE = 0 } = req.body;
    
    const [result] = await promisedb.execute(
      'INSERT INTO vehicule (LIB, TONNAGE) VALUES (?, ?)',
      [LIB.trim(), parseFloat(TONNAGE)]
    );
    
    const newVehicle = {
      ID: result.insertId,
      LIB: LIB.trim(),
      TONNAGE: parseFloat(TONNAGE)
    };
    
    res.status(201).json({
      message: 'Vehicle created successfully',
      data: newVehicle
    });
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// READ - Get all vehicles
router.get('/vehicules', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;
    
    let vehicles, total;
    
    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim()}%`;
      
      // Get vehicles with search
      const vehiclesQuery = `SELECT * FROM vehicule WHERE LIB LIKE ? ORDER BY ID LIMIT ${limitNum} OFFSET ${offset}`;
      const [vehiclesRows] = await promisedb.execute(vehiclesQuery, [searchTerm]);
      vehicles = vehiclesRows;
      
      // Get total count with search
      const [countRows] = await promisedb.execute('SELECT COUNT(*) as total FROM vehicule WHERE LIB LIKE ?', [searchTerm]);
      total = countRows[0].total;
      
    } else {
      // Get all vehicles
      const vehiclesQuery = `SELECT * FROM vehicule ORDER BY ID LIMIT ${limitNum} OFFSET ${offset}`;
      const [vehiclesRows] = await promisedb.execute(vehiclesQuery);
      vehicles = vehiclesRows;
      
      // Get total count
      const [countRows] = await promisedb.execute('SELECT COUNT(*) as total FROM vehicule');
      total = countRows[0].total;
    }
    
    res.json({
      data: vehicles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: total,
        pages: Math.ceil(total / limitNum)
      }
    });
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// READ - Get vehicle by ID
router.get('/vehicules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid vehicle ID'
      });
    }
    
    const [vehicles] = await promisedb.execute(
      'SELECT * FROM vehicule WHERE ID = ?',
      [parseInt(id)]
    );
    
    if (vehicles.length === 0) {
      return res.status(404).json({
        error: 'Vehicle not found'
      });
    }
    
    res.json({
      data: vehicles[0]
    });
  } catch (error) {
    handleDatabaseError(error, res);
  }
});

// UPDATE - Update vehicle by ID
router.put('/vehicules/:id', validateVehicle, async (req, res) => {
  try {
    const { id } = req.params;
    const { LIB, TONNAGE = 0 } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid vehicle ID'
      });
    }
    
    const [result] = await promisedb.execute(
      'UPDATE vehicule SET LIB = ?, TONNAGE = ? WHERE ID = ?',
      [LIB.trim(), parseFloat(TONNAGE), parseInt(id)]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Vehicle not found'
      });
    }
    
    const updatedVehicle = {
      ID: parseInt(id),
      LIB: LIB.trim(),
      TONNAGE: parseFloat(TONNAGE)
    };
    
    res.json({
      message: 'Vehicle updated successfully',
      data: updatedVehicle
    });
  } catch (error) {
    handleDatabaseError(error, res);
  }
});



// DELETE - Delete vehicle by ID
router.delete('/vehicules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid vehicle ID'
      });
    }
    
    // First check if vehicle exists
    const [vehicles] = await promisedb.execute(
      'SELECT * FROM vehicule WHERE ID = ?',
      [parseInt(id)]
    );
    
    if (vehicles.length === 0) {
      return res.status(404).json({
        error: 'Vehicle not found'
      });
    }
    
    const [result] = await promisedb.execute(
      'DELETE FROM vehicule WHERE ID = ?',
      [parseInt(id)]
    );
    
    res.json({
      message: 'Vehicle deleted successfully',
      data: vehicles[0]
    });
  } catch (error) {
    handleDatabaseError(error, res);
  }
});






module.exports = router;