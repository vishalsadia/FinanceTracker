import React, { useEffect, useState, useCallback } from 'react';
import Header from '../Header'; 
import Cards from '../cards';
// import { Modal } from 'antd';
import AddExpenseModal from '../modals/addExpense';
import AddIncomeModal from '../modals/addIncome';
import { addDoc, collection, query, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
// import moment from 'moment';
import TransactionsTable from '../TransactionsTable';
import ChartComponent from '../Charts';
import NoTransactions from '../TransactionsTable/NoTransactions';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  // Function Definitions
  const calculateBalance = useCallback(() => {
    const incomeTotal = transactions.reduce((acc, curr) => curr.type === "income" ? acc + curr.amount : acc, 0);
    const expenseTotal = transactions.reduce((acc, curr) => curr.type === "expense" ? acc + curr.amount : acc, 0);

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  }, [transactions]);

  const addTransaction = useCallback(async (transaction, many = false) => {
    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/transactions`), transaction);
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction Added");
      setTransactions((prevTransactions) => [...prevTransactions, transaction]);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add Transaction");
    }
  }, [user, calculateBalance]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    if (user) {
      try {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        const transactionsArray = querySnapshot.docs.map(doc => doc.data());
        setTransactions(transactionsArray);
        toast.success("Transactions Fetched");
      } catch (e) {
        toast.error("Error fetching transactions");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("No user");
      setLoading(false);
    }
  }, [user]);

  // Effect Hooks
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  useEffect(() => {
    calculateBalance();
  }, [transactions, calculateBalance]);

  // Helper Functions
  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);

  const onFinish = (values, type) => {
    const newTransaction = {
      type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance} 
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          {transactions.length > 0 ? (
            <ChartComponent sortedTransactions={sortedTransactions} />
          ) : (
            <NoTransactions />
          )}

          <AddExpenseModal  
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={(values) => onFinish(values, 'expense')}
          />

          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={(values) => onFinish(values, 'income')}
          />

          <TransactionsTable 
            transactions={sortedTransactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />  
        </>
      )}
    </div>
  );
}

export default Dashboard;
