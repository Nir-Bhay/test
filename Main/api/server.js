const express = require('express');// Make sure this endpoint is properly defined
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
// Add dotenv for environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sinha-library-secret-key'; // Fallback for development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dipukumardevcod:4a2jraytNqTAfmII@sinhalibrary.6b0kuxs.mongodb.net/?retryWrites=true&w=majority&appName=SinhaLibrary';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://sinha-librarydhanbad-hijl.onrender.com', 'https://dipusingh123456789.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(bodyParser.json());

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    // Log the decoded token for debugging
    console.log('Decoded token:', decoded);
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// MongoDB Connection with retry logic
const connectWithRetry = () => {
  console.log('Attempting to connect to MongoDB...');
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  })
  .then(() => {
    console.log('MongoDB Connected Successfully');
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

// User Schema
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  membershipEndDate: { type: Date, default: Date.now }, // Default to current date (0 days)
  createdAt: { type: Date, default: Date.now },
  paymentHistory: [{ type: Object }]
});

const User = mongoose.model('User', UserSchema);

// Expense schema
const ExpenseSchema = new mongoose.Schema({
  type: { type: String, enum: ['expense', 'income'], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, required: true },
  addedBy: { type: String, default: 'Admin' },
  addedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Expense = mongoose.model('Expense', ExpenseSchema);

// Create default admin user if not exists
async function createDefaultAdmin() {
  try {
    const adminEmail = 'admin@sinhalibrary.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        mobileNumber: '1234567890',
        address: 'Sinha Library HQ',
        password: hashedPassword,
        isAdmin: true
      });
      
      await adminUser.save();
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

// Call the function to create default admin
createDefaultAdmin();

// Routes
// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, mobileNumber, address, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      mobileNumber,
      address,
      password: hashedPassword,
      membershipEndDate: new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
    });

    // Save user to database
    await newUser.save();

    // Create and return JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        isAdmin: newUser.isAdmin
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Protected route example
app.get('/api/user', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

// Admin route to get all users
app.get('/api/admin/users', auth, async (req, res) => {
  try {
    // Verify that the requesting user is an admin
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Fetch all users except the current admin
    const users = await User.find({ _id: { $ne: req.user.userId } }).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user days (admin only)
app.post('/api/admin/update-user-days', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await User.findById(decoded.userId);
    
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const { userId, days } = req.body;
    
    if (!userId || !days) {
      return res.status(400).json({ message: 'User ID and days are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate new membership end date
    const currentDate = new Date();
    const newEndDate = new Date(currentDate);
    newEndDate.setDate(currentDate.getDate() + parseInt(days));

    user.membershipEndDate = newEndDate;
    await user.save();

    res.json({ success: true, message: 'User days updated successfully' });
  } catch (error) {
    console.error('Update user days error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user payment (admin only)
app.post('/api/admin/update-user-payment', auth, async (req, res) => {
  try {
    // Check if user is admin
    const admin = await User.findById(req.user.userId);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { userId, amount, days, note } = req.body;
    
    if (!userId || !amount || !days) {
      return res.status(400).json({ message: 'User ID, amount, and days are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate new membership end date
    const currentDate = new Date();
    let newEndDate;
    
    // If membership has expired, start from today
    if (user.membershipEndDate < currentDate) {
      newEndDate = new Date(currentDate);
      newEndDate.setDate(currentDate.getDate() + parseInt(days));
    } else {
      // If membership is still active, add days to current end date
      newEndDate = new Date(user.membershipEndDate);
      newEndDate.setDate(newEndDate.getDate() + parseInt(days));
    }

    user.membershipEndDate = newEndDate;
    user.isMember = true;

    // Create payment record
    const payment = {
      amount: parseInt(amount),
      date: req.body.date ? new Date(req.body.date) : new Date(),
      note: note || 'Admin updated payment',
      adminId: admin._id,
      adminName: `${admin.firstName} ${admin.lastName}`,
      paymentType: req.body.paymentType || 'Membership', // Get payment type from request or default to 'Membership'
      daysAdded: parseInt(days),
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`
    };

    // Add payment to user's payment history
    if (!user.paymentHistory) {
      user.paymentHistory = [];
    }
    user.paymentHistory.push(payment);

    await user.save();
    
    console.log('Payment history updated for user:', user.email);
    console.log('Payment history now contains:', user.paymentHistory.length, 'entries');

    res.json({ success: true, message: 'User payment updated successfully' });
  } catch (error) {
    console.error('Update user payment error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Admin route to update user membership
app.put('/api/admin/users/:userId', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token and check if admin
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await User.findById(decoded.userId);
    
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const { membershipEndDate } = req.body;
    const userId = req.params.userId;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { membershipEndDate: new Date(membershipEndDate) },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create payment record
app.post('/api/record-payment', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { amount, paymentMethod } = req.body;
    
    // Record the payment in database
    // You can create a Payment model to store payment details
    
    // Update user membership status
    user.isMember = true;
    user.membershipExpiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
    await user.save();
    
    res.json({ success: true, message: 'Payment recorded and membership updated' });
  } catch (error) {
    console.error('Payment recording error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update membership status
app.post('/api/update-membership', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Update membership end date (add 30 days)
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + 30);

    await User.findByIdAndUpdate(userId, {
      membershipEndDate: newEndDate
    });

    res.json({ success: true, message: 'Membership updated successfully' });
  } catch (error) {
    console.error('Membership update error:', error);
    res.status(500).json({ message: 'Failed to update membership', error: error.message });
  }
});

// Admin route to confirm payment
app.put('/api/admin/confirm-payment/:userId', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify admin
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await User.findById(decoded.userId);
    
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update membership end date (add 30 days)
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + 30);

    await User.findByIdAndUpdate(userId, {
      membershipEndDate: newEndDate
    });

    res.json({ success: true, message: 'Payment confirmed successfully' });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Failed to confirm payment', error: error.message });
  }
});

// Get user payment history
app.get('/api/user/payment-history', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return payment history or empty array if none exists
    const paymentHistory = user.paymentHistory || [];
    
    res.json({ success: true, paymentHistory });
  } catch (error) {
    console.error('Payment history fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get all payment history (admin only)
app.get('/api/admin/payment-history', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await User.findById(decoded.userId);
    
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    // Get all users with payment history
    const users = await User.find({ paymentHistory: { $exists: true, $ne: [] } })
      .select('firstName lastName email paymentHistory');
    
    // Flatten all payment histories into a single array with user info
    let allPayments = [];
    users.forEach(user => {
      if (user.paymentHistory && user.paymentHistory.length > 0) {
        const paymentsWithUserInfo = user.paymentHistory.map(payment => ({
          ...payment,
          userEmail: user.email,
          userName: `${user.firstName} ${user.lastName}`
        }));
        allPayments = [...allPayments, ...paymentsWithUserInfo];
      }
    });
    
    // Sort by date (newest first)
    allPayments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({ success: true, paymentHistory: allPayments });
  } catch (error) {
    console.error('Admin payment history fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Admin routes
// Get all expenses
app.get('/api/admin/expenses', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }

    // Get all expenses
    const expenses = await Expense.find().sort({ date: -1 });
    
    res.json({ success: true, expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ success: false, message: 'Failed to load expenses' });
  }
});

// Add new expense
app.post('/api/admin/expenses', auth, async (req, res) => {
  try {
    // Log the request user object for debugging
    console.log('Request user object:', req.user);
    
    // Check if user is admin directly from the token
    if (!req.user.isAdmin) {
      console.error('Non-admin user attempted to add expense:', req.user.userId || req.user.id);
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }

    // Get userId from token
    const userId = req.user.userId || req.user._id;
    console.log('Using user ID:', userId);
    
    // Verify user exists in database
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found with ID:', userId);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Double-check user is admin in database
    if (!user.isAdmin) {
      console.error('User in database is not admin:', userId);
      return res.status(403).json({ success: false, message: 'Access denied. User is not admin in database.' });
    }

    const { type, category, amount, date, description } = req.body;
    
    // Validate required fields
    if (!type || !category || !amount || !date || !description) {
      console.error('Missing required fields:', req.body);
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    // Create new expense
    const newExpense = new Expense({
      type,
      category,
      amount,
      date,
      description,
      addedBy: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email || 'Admin',
      addedById: userId
    });
    
    console.log('Saving expense:', newExpense);
    
    // Save expense
    const savedExpense = await newExpense.save();
    console.log('Expense saved successfully:', savedExpense._id);
    
    // If this is a membership payment, add to user's payment history
    if (type === 'income' && category === 'membership' && req.body.userId) {
      const memberUser = await User.findById(req.body.userId);
      if (memberUser) {
        memberUser.paymentHistory.push({
          amount,
          date,
          note: description,
          admin: user.firstName + ' ' + user.lastName,
          days: req.body.days || 0
        });
        await memberUser.save();
        console.log('Added payment to user history:', req.body.userId);
      }
    }
    
    res.json({ success: true, expense: newExpense });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// Delete expense
app.delete('/api/admin/expenses/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }

    // Find and delete expense
    const expense = await Expense.findByIdAndDelete(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update expense
app.put('/api/admin/expenses/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }

    const { type, category, amount, date, description } = req.body;
    
    // Validate required fields
    if (!type || !category || !amount || !date || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    // Find and update expense
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        type,
        category,
        amount,
        date,
        description,
        // Don't update the addedBy field to preserve original creator
      },
      { new: true }
    );
    
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    
    res.json({ success: true, expense });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get current user data including payment history
app.get('/api/user/profile', auth, async (req, res) => {
  try {
    // Use userId from the decoded token
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
  
  // Log all available routes for debugging
  console.log('Available API routes:');
  app._router.stack
    .filter(r => r.route)
    .map(r => {
      const methods = Object.keys(r.route.methods).map(m => m.toUpperCase()).join(',');
      console.log(`${methods} ${r.route.path}`);
    });
});

// Export app for testing purposes
module.exports = app;
