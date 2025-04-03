// In your purchase routes file
router.get('/report', async (req, res) => {
    try {
      const { type, start, end } = req.query;
      const startDate = new Date(start);
      const endDate = new Date(end);
  
      let groupBy;
      let dateFormat;
  
      switch (type) {
        case 'weekly':
          groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } };
          dateFormat = "%Y-%m-%d";
          break;
        case 'monthly':
          groupBy = { $week: "$purchaseDate" };
          dateFormat = "%V"; // Week of year
          break;
        case 'yearly':
          groupBy = { $month: "$purchaseDate" };
          dateFormat = "%m";
          break;
        default:
          return res.status(400).json({ error: 'Invalid report type' });
      }
  
      const reportData = await Purchase.aggregate([
        {
          $match: {
            purchaseDate: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: groupBy,
            totalAmount: { $sum: "$totalPurchaseAmount" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
  
      res.json(reportData);
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });