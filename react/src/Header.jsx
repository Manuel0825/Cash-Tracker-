// Import necessary components and modules
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db, auth } from "./firebase";
import { Typography, TextField, Button, AppBar, Tabs, Tab, Box, Container, Grid } from "@mui/material";
import { styled } from '@mui/system';
import UploadImage from "./UploadImage";

// Styled components
const TransactionList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  marginTop: theme => theme.spacing(2),
});

const TransactionItem = styled('li')({
  marginBottom: theme => theme.spacing(1),
  padding: theme => theme.spacing(1),
  borderRadius: theme => theme.spacing(1),
});

const Incoming = styled(Typography)({
  color: 'green',
});

const Spent = styled(Typography)({
  color: 'red',
});

// Header component
export const Header = () => {
  const [user, setUser] = useState(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [savings, setSavings] = useState(""); // State for savings amount
  const [file, setFile] = useState(null); // Updated state to store image URL
  const [incomingTransactions, setIncomingTransactions] = useState([]);
  const [spentTransactions, setSpentTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("incoming");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchTransactions();
      } else {
        setUser(null);
        setIncomingTransactions([]);
        setSpentTransactions([]);
      }
    });

    return unsubscribe;
  }, []);

  const fetchTransactions = async () => {
    if (user) {
      const userId = user.uid;
      const incoming = [];
      const spent = [];
      try {
        const querySnapshot = await getDocs(query(collection(db, "transactions"), where("userId", "==", userId)));
        querySnapshot.forEach((doc) => {
          const transaction = doc.data();
          transaction.id = doc.id;
          if (transaction.amount >= 0) {
            incoming.push(transaction);
          } else {
            spent.push(transaction);
          }
        });
        setIncomingTransactions(incoming);
        setSpentTransactions(spent);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  };

  const addTransaction = async (newTransaction) => {
    try {
      if (user) {
        const userId = user.uid;
        const transactionWithUserId = { ...newTransaction, userId };
        const docRef = await addDoc(collection(db, "transactions"), transactionWithUserId);
        console.log("Transaction added with ID: ", docRef.id);
        fetchTransactions();
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error adding transaction: ", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      if (user) {
        await deleteDoc(doc(db, "transactions", id));
        console.log("Transaction successfully deleted");
        fetchTransactions();
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error deleting transaction: ", error);
    }
  };

  const getTotalAmount = () => {
    const incomingTotal = incomingTransactions.reduce((total, transaction) => total + transaction.amount, 0).toFixed (2);
    const spentTotal = spentTransactions.reduce((total, transaction) => total - transaction.amount, 0).toFixed(2);
    return incomingTotal - spentTotal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTransaction = {
      description,
      amount: parseFloat(amount),
      file: file,
      savings: parseFloat(savings), // Add savings amount to the new transaction
    };

    addTransaction(newTransaction);
    setDescription("");
    setAmount("");
    setSavings(""); // Clear the savings amount input field
    setFile(null); // Clear the image URL after adding the transaction
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Function to handle the uploaded image URL from UploadImage component
  const handleUploadImage = (imageUrl) => {
    setFile(imageUrl);
  };

  return (
    <>
      <AppBar position="static">
        <Container>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CashTracker
          </Typography>
        </Container>
      </AppBar>
      {user ? (
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>Add Transaction</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="text"
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Savings"
                  value={savings}
                  onChange={(e) => setSavings(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <UploadImage onUpload={handleUploadImage} /> {/* Pass the handleUploadImage function */}
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Add
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      ) : (
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>Please sign in to continue</Typography>
        </Container>
      )}
      {user && (
        <>
          <AppBar position="static" color="default">
            <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
              <Tab label="Incoming Transactions" value="incoming" />
              <Tab label="Spent Transactions" value="spent" />
            </Tabs>
          </AppBar>
          <Container maxWidth="md">
            {activeTab === "incoming" && (
              <Box mt={2}>
                <Typography variant="h5" gutterBottom>Incoming Transactions</Typography>
                <TransactionList>
                  {incomingTransactions.map((transaction) => (
                    <TransactionItem key={transaction.id}>
                      <Incoming>{transaction.description}</Incoming>
                      <Typography>${transaction.amount}</Typography>
                      {transaction.file && <img src={transaction.file} alt="Transaction" />} {/* Display image if available */}
                      <Typography>Savings: ${transaction.savings}</Typography> {/* Display savings amount */}
                      <Button onClick={() => deleteTransaction(transaction.id)}>Delete</Button>
                    </TransactionItem>
                  ))}
                </TransactionList>
              </Box>
            )}
            {activeTab === "spent" && (
              <Box mt={2}>
                <Typography variant="h5" gutterBottom>Spent Transactions</Typography>
                <TransactionList>
                  {spentTransactions.map((transaction) => (
                    <TransactionItem key={transaction.id}>
                      <Spent>{transaction.description}</Spent>
                      <Typography>${transaction.amount}</Typography>
                      {transaction.file && <img src={transaction.file} alt="Transaction" />} {/* Display image if available */}
                      <Typography>Savings: ${transaction.savings}</Typography> {/* Display savings amount */}
                      <Button onClick={() => deleteTransaction(transaction.id)}>Delete</Button>
                    </TransactionItem>
                  ))}
                </TransactionList>
              </Box>
            )}
          </Container>
          <AppBar position="static" color="default">
            <Container>
              <Box py={2} textAlign="center">
                <Typography variant="h6">Total Balance: ${getTotalAmount()}</Typography>
              </Box>
            </Container>
          </AppBar>
        </>
      )}
    </>
  );
};



