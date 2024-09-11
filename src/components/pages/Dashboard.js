import React, { useEffect, useState } from 'react';
import Header from '../Header'; 
import Cards from '../cards';
import { Modal } from 'antd';
import AddExpenseModal from '../modals/addExpense';
import AddIncomeModal from '../modals/addIncome';
import { addDoc, collection, query, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import moment from 'moment';
import TransactionsTable from '../TransactionsTable';
import ChartComponent from '../Charts';
import NoTransactions from '../NoTransactions';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many = false) {
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
  }

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach(doc => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched");
    } else {
      toast.error("No user");
    }

    setLoading(false);
  }

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

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
          {transactions&& transactions.length != 0 ? (
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
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />  
        </>
      )}
    </div>
  );
}

export default Dashboard;
