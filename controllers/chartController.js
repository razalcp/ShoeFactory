const Order = require("../models/orderModel")
const User = require("../models/userModel")


const getSalesChartData = async (req, res) => {


  const orderdata = await Order.aggregate([
    {
      $match: {
        "products.status": "Delivered", // Filter by status "Delivered"
        "createdAt": {
          $gte: new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)) // Filter for the last 7 days
        }
      }
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" }, // Group by day of the week
        count: { $sum: 1 } // Count the documents for each day
      }
    },
    {
      $sort: { "_id": 1 } // Sort by day of the week
    },
    {
      $project: {
        _id: 0,
        dayOfWeek: {
          $switch: {
            branches: [
              { case: { $eq: ["$_id", 1] }, then: "Sunday" },
              { case: { $eq: ["$_id", 2] }, then: "Monday" },
              { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
              { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
              { case: { $eq: ["$_id", 5] }, then: "Thursday" },
              { case: { $eq: ["$_id", 6] }, then: "Friday" },
              { case: { $eq: ["$_id", 7] }, then: "Saturday" },
            ]
          }
        },
        count: 1
      }
    }
  ])

  // console.log(orderdata);


  function getLastSevenWeekdays() {
    let result = [];
    const today = new Date();
    let dayCounter = 1; // Starting from tomorrow

    while (result.length < 7) {
      const date = new Date(today);
      date.setDate(today.getDate() - dayCounter);
      result.push(date.toLocaleDateString('en-US', { weekday: 'long' }));
      dayCounter++;
    }

    return result.reverse(); // Reversing to have the weekdays in ascending order
  }

  const weekdays = getLastSevenWeekdays();


  const result = weekdays.map(day => {
    const found = orderdata.find(obj => obj.dayOfWeek === day);
    return found ? found.count : 0;
  });



  const userData = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          $lte: new Date() // Today
        }
      }
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        dayOfWeek: {
          $switch: {
            branches: [
              { case: { $eq: ["$_id", 1] }, then: "Sunday" },
              { case: { $eq: ["$_id", 2] }, then: "Monday" },
              { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
              { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
              { case: { $eq: ["$_id", 5] }, then: "Thursday" },
              { case: { $eq: ["$_id", 6] }, then: "Friday" },
              { case: { $eq: ["$_id", 7] }, then: "Saturday" }
            ],
            default: "Unknown"
          }
        },
        count: 1
      }
    },
    {
      $sort: { dayOfWeek: 1 } // Sort by day of week (Sunday to Saturday)
    }
  ]);

  const userResult = weekdays.map(day => {
    const found = userData.find(obj => obj.dayOfWeek === day);
    return found ? found.count : 0;
  });


  const today = new Date();
  const lastSevenDays = new Date(today);
  lastSevenDays.setDate(today.getDate() - 7); // Get date from 7 days ago

  // Aggregate orders by weekday and sum the quantities of delivered products for the last 7 days
  const productData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: lastSevenDays, $lt: today }, // Match documents within the last 7 days
        'products.status': 'Delivered'
      }
    },
    {
      $unwind: '$products'
    },
    {
      $match: {
        'products.status': 'Delivered'
      }
    },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        totalQty: { $sum: '$products.qty' }
      }
    },
    {
      $project: {
        _id: 0,
        dayOfWeek: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 1] }, then: 'Sunday' },
              { case: { $eq: ['$_id', 2] }, then: 'Monday' },
              { case: { $eq: ['$_id', 3] }, then: 'Tuesday' },
              { case: { $eq: ['$_id', 4] }, then: 'Wednesday' },
              { case: { $eq: ['$_id', 5] }, then: 'Thursday' },
              { case: { $eq: ['$_id', 6] }, then: 'Friday' },
              { case: { $eq: ['$_id', 7] }, then: 'Saturday' }
            ]
          }
        },
        totalQty: 1
      }
    },
    {
      $sort: { dayOfWeek: 1 }
    }
  ]);




  const productResult = weekdays.map(day => {
    const found = productData.find(obj => obj.dayOfWeek === day);
    return found ? found.totalQty : 0;
  });




  res.json({ status: true, sales: result, weekDays: weekdays, users: userResult, products: productResult })

}

const getSalesChartDataMonthly = async (req, res) => {


  const orderData = await Order.find({})

  const monthStatusCount = {};

  for (const order of orderData) {
    const monthName = new Intl.DateTimeFormat('en', { month: 'long' }).format(order.createdAt);

    if (!monthStatusCount[monthName]) {
      monthStatusCount[monthName] = 0;
    }

    for (const product of order.products) {
      if (product.status === 'Delivered') {
        monthStatusCount[monthName]++;
      }
    }
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const result = months.map(month => monthStatusCount[month] || 0);


  const userData = await User.find({});

  const userCounts = Array.from({ length: 12 }, () => 0);

  for (const user of userData) {
    const month = user.createdAt.getMonth();
    userCounts[month]++;
  }


  const productSoldSums = Array.from({ length: 12 }, () => 0);

  // Iterate over each order
  for (const order of orderData) {
    // Extract the month from the createdAt field
    const month = order.createdAt.getMonth();

    // Iterate over each product in the order
    for (const product of order.products) {
      // Check if the product status is "Delivered"
      if (product.status === 'Delivered') {
        // Add the quantity to the corresponding month's sum
        productSoldSums[month] += product.qty;
      }
    }
  }




  res.json({ status: true, months: months, chartData: result, userCount: userCounts, productSoldSums: productSoldSums })

}

const getSalesChartDataYearly = async (req, res) => {

  const orderData = await Order.find({})

  function countDeliveredOrdersByYear(orders) {
    const currentYear = new Date().getFullYear();
    const counts = Array.from({ length: 11 }, () => 0); // Initialize an array to store counts for 10 years

    // Iterate through the orders
    orders.forEach(order => {
      order.products.forEach(product => {
        // Check if the product status is "Delivered"
        if (product.status === "Delivered") {
          const year = new Date(order.createdAt).getFullYear();
          const index = currentYear - year + 5; // Calculate the index in the counts array
          if (index >= 0 && index < counts.length) {
            counts[index]++; // Increment the count for the corresponding year
          }
        }
      });
    });

    return counts;
  }


  const deliveredCountsByYear = countDeliveredOrdersByYear(orderData);


  function generateYearsArray() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  }

  // Example usage
  const yearsArray = generateYearsArray();

  const userData = await User.find({})
  function countDocumentsByYear(userData) {
    const currentYear = new Date().getFullYear();
    const counts = Array.from({ length: 11 }, () => 0); // Array to store counts for 11 years (5 years back + current year + 5 years forward)

    userData.forEach(user => {
      const userYear = new Date(user.createdAt).getFullYear();
      const index = currentYear - userYear + 5; // Calculate index based on the difference between current year and user's created year

      if (index >= 0 && index < 11) {
        counts[index]++;
      }
    });

    return counts;
  }

  const countsByYear = countDocumentsByYear(userData);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function calculateQuantityByYear(orders) {
    const quantityByYear = {};

    orders.forEach(order => {
      const year = new Date(order.createdAt).getFullYear().toString();
      if (!quantityByYear[year]) {
        quantityByYear[year] = 0;
      }

      order.products.forEach(product => {
        if (product.status === 'Delivered') {
          quantityByYear[year] += product.qty;
        }
      });
    });

    return quantityByYear;
  }

  // Function to generate an array of years considering 5 years back and forth from the current year
  function generateYearsArray() {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      yearsArray.push(i.toString());
    }
    return yearsArray;
  }

  // Calculate sum of quantities by year
  const quantityByYear = calculateQuantityByYear(orderData);

  // Generate years array
  const yearArray = generateYearsArray();

  // Initialize array to store sums
  const productsumsArray = yearArray.map(year => quantityByYear[year] || 0);




  res.json({ status: true, years: yearsArray, deliveredCount: deliveredCountsByYear, userCount: countsByYear, productsaleYearly: productsumsArray })

}


module.exports = { getSalesChartData, getSalesChartDataMonthly, getSalesChartDataYearly }