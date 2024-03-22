import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, query, where } from "firebase/firestore";
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from "./firebase";
import { Typography, TextField, Button, AppBar, Tabs, Tab, Box, Container, Grid } from "@mui/material";
import { styled } from '@mui/system';


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

export const Header = () => {
  const [user, setUser] = useState(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState(null);
  const [incomingTransactions, setIncomingTransactions] = useState([]);
  const [spentTransactions, setSpentTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("incoming");
  const [savingsGoal, setSavingsGoal] = useState(0); // State to hold user's savings goal
  const [savingsProgress, setSavingsProgress] = useState(0); // State to hold savings progress

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchTransactions();
        fetchSavingsGoal(user.uid); // Fetch user's savings goal
      } else {
        setUser(null);
        setIncomingTransactions([]);
        setSpentTransactions([]);
        setSavingsGoal(0); // Reset savings goal if no user is signed in
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    calculateSavingsProgress(); // Recalculate savings progress whenever transactions or savings goal change
  }, [incomingTransactions, spentTransactions, savingsGoal]);

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

  const fetchSavingsGoal = async (userId) => {
    try {
      const docRef = await db.collection('users').doc(userId).get();
      if (docRef.exists) {
        const userData = docRef.data();
        setSavingsGoal(userData.savingsGoal || 0); // Set user's savings goal if available
      }
    } catch (error) {
      console.error('Error fetching savings goal:', error);
    }
  };

  const addTransaction = async (newTransaction) => {
    try {
      if (user) {
        const userId = user.uid;
        const transactionWithUserId = { ...newTransaction, userId };
        await addDoc(collection(db, "transactions"), transactionWithUserId);
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
        await deleteDoc(doc(db, "transactions", id)); // Fixed the deleteDoc function call
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
    const incomingTotal = incomingTransactions.reduce((total, transaction) => total + transaction.amount, 0).toFixed(2);
    const spentTotal = spentTransactions.reduce((total, transaction) => total + transaction.amount, 0).toFixed(2);
    return (incomingTotal - spentTotal).toFixed(2); // Fixed the calculation
  };

  const calculateSavingsProgress = () => {
    const totalSavings = incomingTransactions.reduce((total, transaction) => total + parseFloat(transaction.savings), 0);
    const progress = (totalSavings / savingsGoal) * 100;
    setSavingsProgress(progress);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTransaction = {
      description,
      amount: parseFloat(amount),
      file: file,
    };

    addTransaction(newTransaction);
    setDescription("");
    setAmount("");
    setFile(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUploadImage = async (image) => {
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);
      setFile(imageUrl);
    }
  };
  
  return (
    <>
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
                <div>
                  <input type="file" onChange={(e) => handleUploadImage(e.target.files[0])} />
                  {file && <img src={file} alt="Uploaded" style={{ width: '100px' }} />}
                </div>
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
      {user && (<>
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
                {savingsGoal > 0 && ( // Display savings goal and progress bar if savings goal is set
                  <div>
                    <Typography variant="body1">Savings Goal: ${savingsGoal}</Typography>
                    <LinearProgress variant="determinate" value={savingsProgress} />
                  </div>
                )}
              </Box>
            </Container>
          </AppBar>
        </>
      )}
    </>
  );
};