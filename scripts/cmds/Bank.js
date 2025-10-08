const fs = require('fs');
const path = require('path');

const config = {
    name: "Bank",
    author: "BADHON",
    version: "1.0.0",
    role: "0",
    description: "Complete banking system with deposits, withdrawals, transfers, loans and leaderboard",
    uses: "Bank [command] [args]",
    guide: `
┌───「 BANK HELP 」───
│
├ ➤ Bank create [amount] - Create bank account
├ ➤ Bank balance - Check your balance
├ ➤ Bank deposit <amount> - Deposit money
├ ➤ Bank withdraw <amount> - Withdraw money
├ ➤ Bank transfer <@user|UID> <amount> - Transfer money
├ ➤ Bank loan <amount> - Take a loan
├ ➤ Bank repay [loan_index] - Repay a loan
├ ➤ Bank loans - Check active loans
├ ➤ Bank leaderboard - Top 20 richest players
├ ➤ Bank history [limit] - View transaction history
├ ➤ Bank help - Show this help message
│
└──────────────────
    `
};

class BankSystem {
    constructor() {
        this.dataFile = path.join(__dirname, 'bankData.json');
        this.initialized = false;
    }

    async init() {
        try {
            console.log('🏦 Initializing Bank System...');
            this.loadData();
            this.initialized = true;
            console.log('✅ Bank System initialized successfully');
        } catch (error) {
            console.error('❌ Bank System initialization failed:', error);
            this.initialized = false;
        }
    }

    isInitialized() {
        if (!this.initialized) {
            throw new Error('Bank system is not initialized. Please try again.');
        }
        return true;
    }

    validateUserId(userId) {
        if (!userId || typeof userId !== 'string') {
            throw new Error('Invalid user ID');
        }
        return true;
    }

    validateAmount(amount) {
        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
            throw new Error('Amount must be a positive number');
        }
        if (amount > 1000000000000000) { 
            throw new Error('Amount exceeds maximum limit');
        }
        return true;
    }

    hasUnpaidLoans(userId) {
        try {
            this.validateUserId(userId);
            const user = this.getUser(userId);
            const unpaidLoans = user.loans.filter(loan => !loan.repaid);
            return unpaidLoans.length > 0;
        } catch (error) {
            console.error('Error checking unpaid loans:', error);
            return false;
        }
    }

    hasOverdueLoans(userId) {
        try {
            this.validateUserId(userId);
            const user = this.getUser(userId);
            const unpaidLoans = user.loans.filter(loan => !loan.repaid);
            
            if (unpaidLoans.length === 0) return false;

            const now = new Date();
            const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000; 

            for (const loan of unpaidLoans) {
                const loanDate = new Date(loan.takenAt);
                const timeDiff = now - loanDate;
                
                if (timeDiff > fiveDaysInMs) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error checking overdue loans:', error);
            return false;
        }
    }

    getUnpaidLoanMessage() {
        return 'GORIB AGE LOAN PORISHODH KOR😾';
    }

    getOverdueLoanMessage() {
        return 'ARE JUARI AGER DENA PORISHODH KOR 😾';
    }

    canPerformFinancialOperation(userId) {
        if (this.hasOverdueLoans(userId)) {
            throw new Error(this.getOverdueLoanMessage());
        }
        if (this.hasUnpaidLoans(userId)) {
            throw new Error(this.getUnpaidLoanMessage());
        }
        return true;
    }

    canTakeNewLoan(userId) {
        try {
            this.validateUserId(userId);
            
            if (this.hasUnpaidLoans(userId)) {
                throw new Error(this.getOverdueLoanMessage());
            }
            return true;
        } catch (error) {
            console.error('Loan eligibility check error:', error);
            throw error;
        }
    }

    canPlayGames(userId) {
        try {
            this.validateUserId(userId);
            return !this.hasOverdueLoans(userId);
        } catch (error) {
            console.error('Game access check error:', error);
            return false;
        }
    }

    loadData() {
        try {
            if (fs.existsSync(this.dataFile)) {
                const data = fs.readFileSync(this.dataFile, 'utf8');
                if (!data.trim()) {
                    throw new Error('Bank data file is empty');
                }
                this.users = JSON.parse(data);
                console.log(`📊 Loaded bank data for ${Object.keys(this.users).length} users`);
            } else {
                this.users = {};
                this.saveData();
                console.log('📁 Created new bank data file');
            }
        } catch (error) {
            console.error('❌ Error loading bank data:', error);
            if (fs.existsSync(this.dataFile)) {
                const backupFile = this.dataFile + '.backup_' + Date.now();
                fs.copyFileSync(this.dataFile, backupFile);
                console.log(`💾 Created backup: ${backupFile}`);
            }
            this.users = {};
            this.saveData();
            throw new Error('Bank data corrupted. System reset with new data file.');
        }
    }

    saveData() {
        try {
            if (!this.users) {
                throw new Error('No user data to save');
            }
            fs.writeFileSync(this.dataFile, JSON.stringify(this.users, null, 2));
        } catch (error) {
            console.error('❌ Error saving bank data:', error);
            throw new Error('Failed to save bank data. Please try again.');
        }
    }

    getUser(userId) {
        this.isInitialized();
        this.validateUserId(userId);
        
        if (!this.users[userId]) {
            this.users[userId] = {
                balance: 0,
                loans: [],
                transactions: [],
                username: `User${userId}`,
                createdAt: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                blocked: false
            };
        } else {
            this.users[userId].lastActive = new Date().toISOString();
        }
        return this.users[userId];
    }

    formatMoney(amount) {
        try {
            if (typeof amount !== 'number' || isNaN(amount)) {
                throw new Error('Invalid amount for formatting');
            }

            if (amount >= 1000000000000) {
                return `$${(amount / 1000000000000).toFixed(2)} TRILLION`;
            } else if (amount >= 1000000000) {
                return `$${(amount / 1000000000).toFixed(2)} BILLION`;
            } else if (amount >= 1000000) {
                return `$${(amount / 1000000).toFixed(2)} MILLION`;
            } else if (amount >= 1000) {
                return `$${(amount / 1000).toFixed(2)} THOUSAND`;
            } else {
                return `$${Math.floor(amount)}`;
            }
        } catch (error) {
            console.error('Money formatting error:', error);
            return `$${amount}`;
        }
    }

    formatResponse(message) {
        try {
            if (!message || typeof message !== 'string') {
                throw new Error('Invalid message for formatting');
            }

            const lines = message.split('\n').filter(line => line.trim() !== '');
            if (lines.length === 0) {
                throw new Error('Empty message cannot be formatted');
            }

            let formatted = '┌───「 🏦 BANK SYSTEM 」───\n│\n';
            
            lines.forEach(line => {
                formatted += `├ ➤ ${line}\n`;
            });
            
            formatted += '│\n└──────────────────';
            return formatted;
        } catch (error) {
            console.error('Response formatting error:', error);
            return '┌───「 🏦 BANK SYSTEM 」───\n│\n├ ➤ Error: Unable to format response\n│\n└──────────────────';
        }
    }

    createAccount(userId, username = '', initialBalance = 0) {
        try {
            this.isInitialized();
            this.validateUserId(userId);
            this.validateAmount(initialBalance);

            const user = this.getUser(userId);
            if (user.balance > 0) {
                throw new Error('Account already exists');
            }

            user.balance = initialBalance;
            user.username = username || `User${userId}`;
            user.transactions.push({
                type: 'account_creation',
                amount: initialBalance,
                timestamp: new Date().toISOString(),
                success: true
            });

            this.saveData();
            return this.formatResponse(`Account created successfully!\nInitial balance: ${this.formatMoney(initialBalance)}`);

        } catch (error) {
            console.error('Create account error:', error);
            throw new Error(`Failed to create account: ${error.message}`);
        }
    }

    deposit(userId, amount) {
        try {
            this.isInitialized();
            this.validateUserId(userId);
            this.validateAmount(amount);
            
            this.canPerformFinancialOperation(userId);

            const user = this.getUser(userId);
            user.balance += amount;
            user.transactions.push({
                type: 'deposit',
                amount: amount,
                timestamp: new Date().toISOString(),
                success: true
            });

            this.saveData();
            return this.formatResponse(`Deposited: ${this.formatMoney(amount)}\nNew balance: ${this.formatMoney(user.balance)}`);

        } catch (error) {
            console.error('Deposit error:', error);
            throw new Error(`Deposit failed: ${error.message}`);
        }
    }

    withdraw(userId, amount) {
        try {
            this.isInitialized();
            this.validateUserId(userId);
            this.validateAmount(amount);
            
            this.canPerformFinancialOperation(userId);

            const user = this.getUser(userId);
            if (user.balance < amount) {
                throw new Error('Insufficient funds');
            }

            user.balance -= amount;
            user.transactions.push({
                type: 'withdrawal',
                amount: amount,
                timestamp: new Date().toISOString(),
                success: true
            });

            this.saveData();
            return this.formatResponse(`Withdrew: ${this.formatMoney(amount)}\nNew balance: ${this.formatMoney(user.balance)}`);

        } catch (error) {
            console.error('Withdrawal error:', error);
            throw new Error(`Withdrawal failed: ${error.message}`);
        }
    }

    checkBalance(userId, username = '') {
        try {
            this.isInitialized();
            this.validateUserId(userId);

            const user = this.getUser(userId);
            if (username && user.username === `User${userId}`) {
                user.username = username;
            }

            let response = `👤 Name: ${user.username}\n🆔 UID: ${userId}\n💰 Bank Balance: ${this.formatMoney(user.balance)}`;
            
            if (this.hasUnpaidLoans(userId)) {
                const unpaidLoans = user.loans.filter(loan => !loan.repaid);
                const totalDebt = unpaidLoans.reduce((sum, loan) => sum + loan.totalRepayment, 0);
                
                response += `\n🚫 LOAN STATUS: ${unpaidLoans.length} UNPAID LOAN(S)`;
                response += `\n💸 TOTAL DEBT: ${this.formatMoney(totalDebt)}`;
                
                if (this.hasOverdueLoans(userId)) {
                    response += `\n⏰ STATUS: OVERDUE (5+ days)`;
                    response += `\n⚠️ ${this.getOverdueLoanMessage()}`;
                    response += `\n🔒 All operations blocked until repayment`;
                } else {
                    const oldestLoan = unpaidLoans.sort((a, b) => new Date(a.takenAt) - new Date(b.takenAt))[0];
                    const loanDate = new Date(oldestLoan.takenAt);
                    const now = new Date();
                    const daysPassed = Math.floor((now - loanDate) / (1000 * 60 * 60 * 24));
                    const daysRemaining = Math.max(0, 5 - daysPassed);
                    
                    response += `\n⏰ STATUS: ${daysRemaining} days remaining`;
                    response += `\n⚠️ ${this.getUnpaidLoanMessage()}`;
                    response += `\n🎮 Games: Allowed (within 5 days)`;
                }
            }

            return this.formatResponse(response);

        } catch (error) {
            console.error('Balance check error:', error);
            throw new Error(`Failed to check balance: ${error.message}`);
        }
    }

    transfer(senderId, receiverId, amount, receiverName = '') {
        try {
            this.isInitialized();
            this.validateUserId(senderId);
            this.validateUserId(receiverId);
            this.validateAmount(amount);
            
            this.canPerformFinancialOperation(senderId);

            if (senderId === receiverId) {
                throw new Error('Cannot transfer to yourself');
            }

            const sender = this.getUser(senderId);
            const receiver = this.getUser(receiverId);

            if (receiverName) {
                receiver.username = receiverName;
            }

            if (sender.balance < amount) {
                throw new Error('Insufficient funds for transfer');
            }

            sender.balance -= amount;
            receiver.balance += amount;

            sender.transactions.push({
                type: 'transfer_out',
                amount: amount,
                to: receiverId,
                toName: receiver.username,
                timestamp: new Date().toISOString(),
                success: true
            });

            receiver.transactions.push({
                type: 'transfer_in',
                amount: amount,
                from: senderId,
                fromName: sender.username,
                timestamp: new Date().toISOString(),
                success: true
            });

            this.saveData();
            return this.formatResponse(`Transferred: ${this.formatMoney(amount)}\nTo: ${receiver.username}\nYour new balance: ${this.formatMoney(sender.balance)}`);

        } catch (error) {
            console.error('Transfer error:', error);
            throw new Error(`Transfer failed: ${error.message}`);
        }
    }

    takeLoan(userId, amount, interestRate = 0.1) {
        try {
            this.isInitialized();
            this.validateUserId(userId);
            this.validateAmount(amount);
            
            // Check if user can take new loan
            this.canTakeNewLoan(userId);

            if (amount > 10000) {
                throw new Error('Maximum loan amount is $10,000');
            }

            const user = this.getUser(userId);
            const interest = amount * interestRate;
            const totalRepayment = amount + interest;

            const loan = {
                id: Date.now().toString(),
                amount: amount,
                interest: interest,
                totalRepayment: totalRepayment,
                takenAt: new Date().toISOString(),
                repaid: false
            };

            user.loans.push(loan);
            user.balance += amount;

            user.transactions.push({
                type: 'loan_taken',
                amount: amount,
                interest: interest,
                timestamp: new Date().toISOString(),
                success: true
            });

            this.saveData();
            return this.formatResponse(`Loan Approved!\nAmount: ${this.formatMoney(amount)}\nInterest: ${this.formatMoney(interest)}\nTotal to repay: ${this.formatMoney(totalRepayment)}\nNew balance: ${this.formatMoney(user.balance)}\n\n⏰ You have 5 days to repay the loan\n🎮 Games: Allowed (within 5 days)\n⚠️ After 5 days: All operations will be blocked!`);

        } catch (error) {
            console.error('Loan error:', error);
            throw new Error(`Loan application failed: ${error.message}`);
        }
    }

    repayLoan(userId, loanIndex = 0) {
        try {
            this.isInitialized();
            this.validateUserId(userId);

            const user = this.getUser(userId);
            if (user.loans.length === 0) {
                throw new Error('No active loans found');
            }

            if (loanIndex >= user.loans.length || loanIndex < 0) {
                throw new Error('Invalid loan index');
            }

            const loan = user.loans[loanIndex];
            if (loan.repaid) {
                throw new Error('This loan is already repaid');
            }

            if (user.balance < loan.totalRepayment) {
                throw new Error(`Insufficient funds to repay loan. Need: ${this.formatMoney(loan.totalRepayment)}`);
            }

            user.balance -= loan.totalRepayment;
            loan.repaid = true;
            loan.repaidAt = new Date().toISOString();

            user.transactions.push({
                type: 'loan_repaid',
                amount: loan.totalRepayment,
                timestamp: new Date().toISOString(),
                success: true
            });

            this.saveData();
            
            const remainingLoans = user.loans.filter(loan => !loan.repaid).length;
            let message = `Loan Repaid Successfully!\nAmount: ${this.formatMoney(loan.totalRepayment)}\nNew balance: ${this.formatMoney(user.balance)}`;
            
            if (remainingLoans === 0) {
                message += `\n🎉 All loans cleared! All restrictions removed.`;
            } else {
                message += `\n📝 Remaining loans: ${remainingLoans}`;
            }
            
            return this.formatResponse(message);

        } catch (error) {
            console.error('Loan repayment error:', error);
            throw new Error(`Loan repayment failed: ${error.message}`);
        }
    }

    checkLoans(userId) {
        try {
            this.isInitialized();
            this.validateUserId(userId);

            const user = this.getUser(userId);
            const activeLoans = user.loans.filter(loan => !loan.repaid);

            if (activeLoans.length === 0) {
                return this.formatResponse('No active loans');
            }

            let response = 'Your Active Loans:\n';
            activeLoans.forEach((loan, index) => {
                const loanDate = new Date(loan.takenAt);
                const now = new Date();
                const daysPassed = Math.floor((now - loanDate) / (1000 * 60 * 60 * 24));
                const daysRemaining = Math.max(0, 5 - daysPassed);
                const status = daysPassed >= 5 ? 'OVERDUE 🔴' : `OK 🟢 (${daysRemaining} days left)`;
                
                response += `${index + 1}. Amount: ${this.formatMoney(loan.amount)}\n   Interest: ${this.formatMoney(loan.interest)}\n   Total: ${this.formatMoney(loan.totalRepayment)}\n   Status: ${status}\n   Taken: ${daysPassed} days ago\n`;
            });

            if (this.hasOverdueLoans(userId)) {
                response += `\n🚫 ${this.getOverdueLoanMessage()}`;
                response += `\n🔒 ALL OPERATIONS BLOCKED (Deposit, Withdraw, Transfer, Games)`;
            } else {
                response += `\n⚠️ ${this.getUnpaidLoanMessage()}`;
                response += `\n🎮 Games: Currently Allowed`;
                response += `\n⏰ After 5 days: All operations will be blocked!`;
            }

            return this.formatResponse(response);

        } catch (error) {
            console.error('Check loans error:', error);
            throw new Error(`Failed to check loans: ${error.message}`);
        }
    }

    getLoanRestrictionMessage(userId) {
        try {
            if (this.hasOverdueLoans(userId)) {
                const user = this.getUser(userId);
                const unpaidLoans = user.loans.filter(loan => !loan.repaid);
                const totalDebt = unpaidLoans.reduce((sum, loan) => sum + loan.totalRepayment, 0);
                
                return this.formatResponse(
                    `🚫 ACCESS DENIED!\n${this.getOverdueLoanMessage()}\n\n📊 Loan Details:\nUnpaid Loans: ${unpaidLoans.length}\nTotal Debt: ${this.formatMoney(totalDebt)}\nStatus: OVERDUE (5+ days)\n\n🔒 All operations blocked\n💡 Use "Bank repay" to clear your loans and restore access.`
                );
            }
            return null;
        } catch (error) {
            console.error('Loan restriction message error:', error);
            return this.formatResponse('Error checking loan status');
        }
    }

    getLeaderboard(limit = 20) {
        try {
            this.isInitialized();

            const usersArray = Object.entries(this.users)
                .map(([userId, data]) => ({
                    userId,
                    username: data.username,
                    balance: data.balance,
                    hasUnpaidLoans: data.loans && data.loans.some(loan => !loan.repaid),
                    hasOverdueLoans: data.loans && data.loans.some(loan => {
                        if (loan.repaid) return false;
                        const loanDate = new Date(loan.takenAt);
                        const now = new Date();
                        return (now - loanDate) > (5 * 24 * 60 * 60 * 1000);
                    })
                }))
                .filter(user => user.balance > 0)
                .sort((a, b) => b.balance - a.balance)
                .slice(0, limit);

            if (usersArray.length === 0) {
                return this.formatResponse('Bank Leaderboard is empty!');
            }

            let leaderboardLines = ['🏆 BANK LEADERBOARD 🏆', ''];

            usersArray.forEach((user, index) => {
                const rank = index + 1;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
                let userLine = `${medal} ${user.username}`;
                
                if (user.hasOverdueLoans) {
                    userLine += ' 🔴';
                } else if (user.hasUnpaidLoans) {
                    userLine += ' 🟡';
                }
                
                leaderboardLines.push(userLine);
                leaderboardLines.push(`   🆔: ${user.userId}`);
                leaderboardLines.push(`   💰 Balance: ${this.formatMoney(user.balance)}`);
                
                if (user.hasOverdueLoans) {
                    leaderboardLines.push(`   ⚠️ Overdue loans (BLOCKED)`);
                } else if (user.hasUnpaidLoans) {
                    leaderboardLines.push(`   ⚠️ Has unpaid loans`);
                }
                
                if (index < usersArray.length - 1) leaderboardLines.push('');
            });

            return this.formatResponse(leaderboardLines.join('\n'));

        } catch (error) {
            console.error('Leaderboard error:', error);
            throw new Error(`Failed to load leaderboard: ${error.message}`);
        }
    }

    getTransactionHistory(userId, limit = 10) {
        try {
            this.isInitialized();
            this.validateUserId(userId);

            const user = this.getUser(userId);
            const transactions = user.transactions.slice(-limit).reverse();

            if (transactions.length === 0) {
                return this.formatResponse('No transaction history found');
            }

            let history = '📜 TRANSACTION HISTORY 📜\n';

            transactions.forEach(transaction => {
                const date = new Date(transaction.timestamp).toLocaleDateString();
                let description = '';
                let emoji = '';

                switch (transaction.type) {
                    case 'deposit':
                        description = `Deposit: +${this.formatMoney(transaction.amount)}`;
                        emoji = '💰';
                        break;
                    case 'withdrawal':
                        description = `Withdrawal: -${this.formatMoney(transaction.amount)}`;
                        emoji = '💸';
                        break;
                    case 'transfer_in':
                        description = `From ${transaction.fromName}: +${this.formatMoney(transaction.amount)}`;
                        emoji = '📥';
                        break;
                    case 'transfer_out':
                        description = `To ${transaction.toName}: -${this.formatMoney(transaction.amount)}`;
                        emoji = '📤';
                        break;
                    case 'loan_taken':
                        description = `Loan: +${this.formatMoney(transaction.amount)}`;
                        emoji = '🏦';
                        break;
                    case 'loan_repaid':
                        description = `Loan Repaid: -${this.formatMoney(transaction.amount)}`;
                        emoji = '✅';
                        break;
                    case 'account_creation':
                        description = `Account Created: +${this.formatMoney(transaction.amount)}`;
                        emoji = '🎉';
                        break;
                    default:
                        description = `${transaction.type}: ${this.formatMoney(transaction.amount)}`;
                        emoji = '❓';
                }

                history += `${emoji} ${description}\n   📅 ${date}\n`;
            });

            return this.formatResponse(history);

        } catch (error) {
            console.error('Transaction history error:', error);
            throw new Error(`Failed to load transaction history: ${error.message}`);
        }
    }

    showHelp() {
        try {
            this.isInitialized();
            return config.guide;
        } catch (error) {
            console.error('Help error:', error);
            return this.formatResponse('System error: Unable to load help guide');
        }
    }

    getSystemStatus() {
        try {
            this.isInitialized();
            const totalUsers = Object.keys(this.users).length;
            const totalBalance = Object.values(this.users).reduce((sum, user) => sum + user.balance, 0);
            const activeLoans = Object.values(this.users).reduce((sum, user) => 
                sum + user.loans.filter(loan => !loan.repaid).length, 0);
            const overdueLoans = Object.values(this.users).filter(user => 
                this.hasOverdueLoans(user.userId)).length;

            return this.formatResponse(
                `System Status: ✅ ONLINE\nTotal Users: ${totalUsers}\nTotal Bank Balance: ${this.formatMoney(totalBalance)}\nActive Loans: ${activeLoans}\nOverdue Loans: ${overdueLoans}\nLast Updated: ${new Date().toLocaleString()}`
            );
        } catch (error) {
            console.error('System status error:', error);
            return this.formatResponse('System Status: ❌ OFFLINE\nError: System initialization failed');
        }
    }
}

// Create global instance
const bankSystem = new BankSystem();

// Command handler function with comprehensive error handling
async function handleBankCommand(command, userId, args = [], username = '') {
    try {
        // Wait for system initialization
        if (!bankSystem.initialized) {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (!bankSystem.initialized) {
                throw new Error('Bank system is initializing. Please try again in a moment.');
            }
        }

        switch (command) {
            case 'create':
                return bankSystem.createAccount(userId, username, parseInt(args[0]) || 100);
                
            case 'balance':
            case 'bal':
                return bankSystem.checkBalance(userId, username);
                
            case 'deposit':
            case 'dep':
                if (!args[0] || isNaN(parseInt(args[0]))) {
                    throw new Error('Please specify a valid amount: Bank deposit <amount>');
                }
                return bankSystem.deposit(userId, parseInt(args[0]));
                
            case 'withdraw':
            case 'with':
                if (!args[0] || isNaN(parseInt(args[0]))) {
                    throw new Error('Please specify a valid amount: Bank withdraw <amount>');
                }
                return bankSystem.withdraw(userId, parseInt(args[0]));
                
            case 'transfer':
            case 't':
                if (args.length < 2) {
                    throw new Error('Usage: Bank transfer <@user|UID> <amount>');
                }
                const targetUser = args[0].replace(/[<@!>]/g, '');
                const amount = parseInt(args[1]);
                if (isNaN(amount)) {
                    throw new Error('Please specify a valid amount');
                }
                const targetName = args[2] || `User${targetUser}`;
                return bankSystem.transfer(userId, targetUser, amount, targetName);
                
            case 'loan':
                if (!args[0] || isNaN(parseInt(args[0]))) {
                    throw new Error('Please specify a valid loan amount: Bank loan <amount>');
                }
                return bankSystem.takeLoan(userId, parseInt(args[0]));
                
            case 'repay':
                return bankSystem.repayLoan(userId, parseInt(args[0]) || 0);
                
            case 'loans':
                return bankSystem.checkLoans(userId);
                
            case 'leaderboard':
            case 'lb':
                return bankSystem.getLeaderboard(20);
                
            case 'history':
            case 'transactions':
                const limit = args[0] && !isNaN(parseInt(args[0])) ? parseInt(args[0]) : 10;
                return bankSystem.getTransactionHistory(userId, limit);
                
            case 'status':
                return bankSystem.getSystemStatus();
                
            case 'help':
                return bankSystem.showHelp();
                
            default:
                throw new Error('Unknown command. Type "Bank help" for available commands.');
        }
    } catch (error) {
        console.error(`Bank command error [${command}]:`, error);
        return bankSystem.formatResponse(`Error: ${error.message}`);
    }
}

// External functions for other modules (like slot games)
function canUserPlayGames(userId) {
    return bankSystem.canPlayGames(userId);
}

function getLoanRestrictionMessage(userId) {
    return bankSystem.getLoanRestrictionMessage(userId);
}

// Module initialization
async function initializeBankModule() {
    try {
        console.log('🔄 Starting Bank Module...');
        await bankSystem.init();
        console.log('✅ Bank Module started successfully');
        return true;
    } catch (error) {
        console.error('❌ Bank Module failed to start:', error);
        return false;
    }
}

// onStart function that gets called when the module loads
function onStart() {
    console.log('🏦 Bank System Module Starting...');
    initializeBankModule().then(success => {
        if (success) {
            console.log('✅ Bank System Started Successfully!');
        } else {
            console.log('❌ Bank System Failed to Start!');
        }
    });
    return true;
}

// onCall function for handling commands
async function onCall({ message, args }) {
    try {
        const command = args[0]?.toLowerCase() || 'help';
        const userId = message.senderID;
        const username = message.senderName || '';
        const commandArgs = args.slice(1);

        const response = await handleBankCommand(command, userId, commandArgs, username);
        
        if (response) {
            message.reply(response);
        }
    } catch (error) {
        console.error('Bank onCall error:', error);
        message.reply('❌ An error occurred while processing your bank command. Please try again.');
    }
}

// Export for use in other files
module.exports = {
    config,
    onStart,
    onCall,
    handleBankCommand,
    bankSystem,
    canUserPlayGames,
    getLoanRestrictionMessage
};
