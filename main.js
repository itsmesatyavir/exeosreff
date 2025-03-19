const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const chalk = require('chalk'); // Import chalk

function displayBanner() {
    const title = "Forest Army";
    const line = "=".repeat(title.length + 10);
    console.log(chalk.green(line)); // Change line color to green
    console.log(chalk.yellow(`====  ${title}  ==== `)); // Change title color to yellow
    console.log(chalk.green(line)); // Change line color to green
    console.log("");
}

// ... (rest of your existing code remains unchanged)

class ExeosAutoReferral {
    // ... (existing class code)
}

// ... (rest of your existing functions)

async function main() {
    displayBanner();
    
    let referralCode;
    try {
        referralCode = fs.existsSync('code.txt') ? fs.readFileSync('code.txt', 'utf8').trim() : '';
        if (!referralCode) {
            throw new Error('Referral code in code.txt is empty');
        }
        console.log(`Using referral code from code.txt: ${referralCode}`);
    } catch (error) {
        console.error('Error reading code.txt:', error.message);
        console.log('Falling back to default referral code: REFAVTANGCE');
        referralCode = 'REFAVTANGCE';
    }

    const proxies = readProxiesFromFile('proxies.txt');
    
    const referralCountInput = await getUser Input('Enter the number of accounts to create: ');
    const referralCount = parseInt(referralCountInput, 10) || 5;
    console.log(`Will create ${referralCount} accounts`);

    try {
        console.log(`Starting ExeosAutoReferral bot - Creating ${referralCount} referrals with code: ${referralCode}`);
        console.log(`Using ${proxies.length} proxies`);

        let successCount = 0;
        let createdAccounts = [];

        for (let i = 0; i < referralCount; i++) {
            console.log(`\n📝 Creating referral ${i + 1}/${referralCount}...`);
            
            let currentProxy = null;
            if (proxies.length > 0) {
                currentProxy = proxies[i % proxies.length];
                console.log(`Using proxy: ${currentProxy}`);
            }
            
            try {
                const bot = new ExeosAutoReferral(referralCode, currentProxy);
                const account = await bot.createReferral();
                
                createdAccounts.push(account);
                successCount++;
                
                if (i < referralCount - 1) {
                    await bot.randomDelay(5000, 15000);
                }
            } catch (error) {
                console.error(`Failed to create referral ${i + 1}: ${error.message}`);
                if (i < referralCount - 1) {
                    console.log('Delaying for longer period after error...');
                    await new Promise(resolve => setTimeout(resolve, 15000 + Math.random() * 10000));
                }
            }
        }

        saveAccountsToJson(createdAccounts, 'accounts.json');
        
        console.log(`\n🎉 Process completed! Successfully created ${successCount}/${referralCount} referrals.`);
        console.log('Results saved to accounts.json');
    } catch (error) {
        console.error('Main process error:', error.message);
    }
}

main();
