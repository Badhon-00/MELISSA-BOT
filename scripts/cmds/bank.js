const fs = require('fs');
const path = require('path');

const config = {
    name: "bank",
    author: "BADHON",
    version: "1.0.0",
    role: "0",
    description: "Complete banking system with deposits, withdrawals, transfers, loans and leaderboard",
    uses: "bank [command] [args]",
    guide: `
┌───「 BANK HELP 」───
│
├ ➤ bank status - Check your balance
├ ➤ bank bal -d <amount> - Deposit money
├ ➤ bank bal -w <amount> - Withdraw money
├ ➤ bank bal -l <amount> - Take a loan
├ ➤ bank bal -l -p <amount> - Repay loan with specific amount
├ ➤ bank top - Top 20 richest players
│
└──────────────────
    `
};

class BankSystem {
    constructor() {
        this.dataFile = path.join(__dirname, 'bankData.json');
        this.initialized = false;
        this.users = {};
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

    loadData() {
        try {
            if (fs.existsSync(this.dataFile)) {
                const data = fs.readFileSync(this.dataFile, 'utf8');
                if (!data.trim()) {
                    console.log('Bank data file is empty, initializing new data');
                    this.users = {};
                    this.saveData();
                    return;
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
                try {
                    fs.copyFileSync(this.dataFile, backupFile);
                    console.log(`💾 Created backup: ${backupFile}`);
                } catch (backupError) {
                    console.error('Failed to create backup:', backupError);
                }
            }
            this.users = {};
            this.saveData();
            console.log('🔄 Bank data reset due to corruption');
        }
    }

    saveData() {
        try {
            if (!this.users) {
                console.warn('No user data to save, initializing empty data');
                this.users = {};
            }
            const data = JSON.stringify(this.users, null, 2);
            fs.writeFileSync(this.dataFile, data, 'utf8');
        } catch (error) {
            console.error('❌ Error saving bank data:', error);
            throw new Error('Failed to save bank data. Please try again.');
        }
    }

    getUser(userId) {
        this.isInitialized();
        this.validateUserId(userId);
        
        if (!this.users[userId]) {
            // Auto-create account with zero balance when user first interacts
            this.users[userId] = {
                balance: 0,
                loans: [],
                transactions: [],
                username: `User${userId}`,
                createdAt: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                blocked: false
            };
            this.saveData();
        } else {
            this.users[userId].lastActive = new Date().toISOString();
        }
        return this.users[userId];
    }

    formatMoney(amount) {
        try {
            if (typeof amount !== 'number' || isNaN(amount)) {
                return '$0';
            }

            if (amount >= 1000000000000) {
                return `$${(amount / 1000000000000).toFixed(2)}T`;
            } else if (amount >= 1000000000) {
                return `$${(amount / 1000000000).toFixed(2)}B`;
            } else if (amount >= 1000000) {
                return `$${(amount / 1000000).toFixed(2)}M`;
            } else if (amount >= 1000) {
                return `$${(amount / 1000).toFixed(2)}K`;
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
                return '┌───「 🏦 BANK SYSTEM 」───\n│\n├ ➤ Error: Invalid response\n│\n└──────────────────';
            }

            const lines = message.split('\n').filter(line => line.trim() !== '');
            if (lines.length === 0) {
                return '┌───「 🏦 BANK SYSTEM 」───\n│\n├ ➤ No content\n│\n└──────────────────';
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

    checkBalance(userId, username = '') {
        try {
            this.isInitialized();
            this.validateUserId(userId);

            const user = this.getUser(userId);
            if (username && user.username === `User${userId}`) {
                user.username = username;
                this.saveData();
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
                }
            }

            return this.formatResponse(response);

        } catch (error) {
            console.error('Balance check error:', error);
            throw new Error(`Failed to check balance: ${error.message}`);
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

    takeLoan(userId, amount, interestRate = 0.1) {
        try {
            this.isInitialized();
            this.validateUserId(userId);
            this.validateAmount(amount);
            
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
            return this.formatResponse(`Loan Approved!\nAmount: ${this.formatMoney(amount)}\nInterest: ${this.formatMoney(interest)}\nTotal to repay: ${this.formatMoney(totalRepayment)}\nNew balance: ${this.formatMoney(user.balance)}\n\n⏰ You have 5 days to repay the loan\n⚠️ After 5 days: All operations will be blocked!`);

        } catch (error) {
            console.error('Loan error:', error);
            throw new Error(`Loan application failed: ${error.message}`);
        }
    }

    repayLoan(userId, repaymentAmount) {
        try {
            this.isInitialized();
            this.validateUserId(userId);
            this.validateAmount(repaymentAmount);

            const user = this.getUser(userId);
            const unpaidLoans = user.loans.filter(loan => !loan.repaid);

            if (unpaidLoans.length === 0) {
                throw new Error('No active loans found');
            }

            if (user.balance < repaymentAmount) {
                throw new Error(`Insufficient funds. You have ${this.formatMoney(user.balance)} but trying to repay ${this.formatMoney(repaymentAmount)}`);
            }

            // Sort loans by oldest first (prioritize overdue loans)
            unpaidLoans.sort((a, b) => new Date(a.takenAt) - new Date(b.takenAt));

            let remainingAmount = repaymentAmount;
            let loansRepaid = 0;
            let totalRepaid = 0;

            for (let loan of unpaidLoans) {
                if (remainingAmount <= 0) break;

                if (remainingAmount >= loan.totalRepayment) {
                    // Full repayment of this loan
                    const loanAmount = loan.totalRepayment;
                    remainingAmount -= loanAmount;
                    loan.repaid = true;
                    loan.repaidAt = new Date().toISOString();
                    loansRepaid++;
                    totalRepaid += loanAmount;
                    
                    user.transactions.push({
                        type: 'loan_repaid',
                        amount: loanAmount,
                        timestamp: new Date().toISOString(),
                        success: true
                    });
                } else {
                    // Partial repayment - not allowed in this system
                    throw new Error(`Repayment amount ${this.formatMoney(repaymentAmount)} is not enough to fully repay any loan. Minimum required: ${this.formatMoney(loan.totalRepayment)}`);
                }
            }

            // Deduct from balance
            user.balance -= repaymentAmount;

            this.saveData();

            let message = `Loan Repayment Successful!\nAmount paid: ${this.formatMoney(repaymentAmount)}\nLoans cleared: ${loansRepaid}\nNew balance: ${this.formatMoney(user.balance)}`;
            
            const remainingLoans = user.loans.filter(loan => !loan.repaid).length;
            if (remainingLoans === 0) {
                message += `\n🎉 All loans cleared! All restrictions removed.`;
            } else {
                message += `\n📝 Remaining loans: ${remainingLoans}`;
                const nextLoan = unpaidLoans.find(loan => !loan.repaid);
                if (nextLoan) {
                    message += `\n💡 Next loan to repay: ${this.formatMoney(nextLoan.totalRepayment)}`;
                }
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
            const unpaidLoans = user.loans.filter(loan => !loan.repaid);

            if (unpaidLoans.length === 0) {
                return this.formatResponse('No active loans');
            }

            let response = 'Your Active Loans:\n\n';
            unpaidLoans.forEach((loan, index) => {
                const loanDate = new Date(loan.takenAt);
                const now = new Date();
                const daysPassed = Math.floor((now - loanDate) / (1000 * 60 * 60 * 24));
                const daysRemaining = Math.max(0, 5 - daysPassed);
                const status = daysPassed >= 5 ? 'OVERDUE 🔴' : `OK 🟢 (${daysRemaining} days left)`;
                
                response += `💰 Loan ${index + 1}:\n`;
                response += `   Original: ${this.formatMoney(loan.amount)}\n`;
                response += `   Interest: ${this.formatMoney(loan.interest)}\n`;
                response += `   Total Due: ${this.formatMoney(loan.totalRepayment)}\n`;
                response += `   Status: ${status}\n`;
                response += `   Taken: ${daysPassed} days ago\n\n`;
            });

            const totalDebt = unpaidLoans.reduce((sum, loan) => sum + loan.totalRepayment, 0);
            response += `💸 TOTAL DEBT: ${this.formatMoney(totalDebt)}`;

            if (this.hasOverdueLoans(userId)) {
                response += `\n\n🚫 ${this.getOverdueLoanMessage()}`;
                response += `\n🔒 ALL OPERATIONS BLOCKED`;
            } else {
                response += `\n\n⚠️ ${this.getUnpaidLoanMessage()}`;
                response += `\n💡 Use: bank bal -l -p <amount> to repay`;
            }

            return this.formatResponse(response);

        } catch (error) {
            console.error('Check loans error:', error);
            throw new Error(`Failed to check loans: ${error.message}`);
        }
    }

    getLeaderboard() {
        try {
            this.isInitialized();
            
            const usersWithBalance = Object.entries(this.users)
                .filter(([userId, user]) => user.balance > 0)
                .sort(([,a], [,b]) => b.balance - a.balance)
                .slice(0, 20);

            if (usersWithBalance.length === 0) {
                return this.formatResponse('No users with balance found');
            }

            let response = '🏆 TOP 20 RICHEST PLAYERS:\n\n';
            usersWithBalance.forEach(([userId, user], index) => {
                const rank = index + 1;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
                response += `${medal} ${user.username}: ${this.formatMoney(user.balance)}\n`;
            });

            return this.formatResponse(response);

        } catch (error) {
            console.error('Leaderboard error:', error);
            throw new Error(`Failed to get leaderboard: ${error.message}`);
        }
    }
}

// Initialize bank system
const bankSystem = new BankSystem();

// Initialize when module loads
bankSystem.init().catch(console.error);

async function onCall({ message, args, getLang }) {
    try {
        const command = args[0]?.toLowerCase();
        const userId = message.senderID;
        const userName = message.senderName || `User${userId}`;

        // Ensure bank system is initialized
        if (!bankSystem.initialized) {
            await bankSystem.init();
        }

        // Handle bank status command
        if (command === 'status') {
            const result = bankSystem.checkBalance(userId, userName);
            return message.reply(result);
        }

        // Handle bank bal commands with flags
        if (command === 'bal' || command === 'balance') {
            const flag = args[1]?.toLowerCase();
            const amount = parseFloat(args[2]);

            if (!flag) {
                // Just show balance if no flag provided
                const result = bankSystem.checkBalance(userId, userName);
                return message.reply(result);
            }

            switch (flag) {
                case '-d': // Deposit
                    if (!amount || isNaN(amount)) {
                        return message.reply(bankSystem.formatResponse('Please specify a valid amount to deposit\nUsage: bank bal -d <amount>'));
                    }
                    const depositResult = bankSystem.deposit(userId, amount);
                    return message.reply(depositResult);

                case '-w': // Withdraw
                    if (!amount || isNaN(amount)) {
                        return message.reply(bankSystem.formatResponse('Please specify a valid amount to withdraw\nUsage: bank bal -w <amount>'));
                    }
                    const withdrawResult = bankSystem.withdraw(userId, amount);
                    return message.reply(withdrawResult);

                case '-l': // Loan operations
                    const loanAction = args[2]?.toLowerCase();
                    
                    if (loanAction === '-p') {
                        // Loan repayment with amount
                        const repaymentAmount = parseFloat(args[3]);
                        if (!repaymentAmount || isNaN(repaymentAmount)) {
                            // Show loan status if no amount specified
                            const loanStatus = bankSystem.checkLoans(userId);
                            return message.reply(loanStatus);
                        }
                        const repayResult = bankSystem.repayLoan(userId, repaymentAmount);
                        return message.reply(repayResult);
                    } else {
                        // Take new loan
                        const loanAmount = parseFloat(args[2]);
                        if (!loanAmount || isNaN(loanAmount)) {
                            return message.reply(bankSystem.formatResponse('Please specify a valid loan amount\nUsage: bank bal -l <amount>'));
                        }
                        const loanResult = bankSystem.takeLoan(userId, loanAmount);
                        return message.reply(loanResult);
                    }

                default:
                    return message.reply(bankSystem.formatResponse('Invalid flag. Use:\n- -d <amount> to deposit\n- -w <amount> to withdraw\n- -l <amount> to take loan\n- -l -p <amount> to repay loan'));
            }
        }

        // Handle bank top command
        if (command === 'top') {
            const result = bankSystem.getLeaderboard();
            return message.reply(result);
        }

        // Handle help or no command
        if (!command || command === 'help') {
            return message.reply(config.guide);
        }

        // If no valid command matched
        return message.reply(bankSystem.formatResponse('Invalid command. Use "bank help" to see available commands.'));

    } catch (error) {
        console.error('Bank command error:', error);
        const errorMessage = bankSystem.formatResponse(`Error: ${error.message}`);
        return message.reply(errorMessage);
    }
}

module.exports = {
    config,
    onCall
};