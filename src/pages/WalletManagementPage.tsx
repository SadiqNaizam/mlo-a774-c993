import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Though not heavily used directly, good for potential internal links

// Custom Components
import AppBottomTabBar from '@/components/layout/AppBottomTabBar';
import DynamicScreenHeader from '@/components/layout/DynamicScreenHeader';
import AnimatedNumericDisplay from '@/components/AnimatedNumericDisplay';
import GlassmorphismTradingCard from '@/components/GlassmorphismTradingCard';

// shadcn/ui Components
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Recharts for Pie Chart
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Lucide Icons
import { Download, Upload, Copy, QrCode, ChevronRight, PlusCircle, Trash2, BookUser, Settings2, Search, ExternalLink } from 'lucide-react';

// Types
interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  valueUSD: number;
  color: string;
  iconUrl?: string; // Optional: URL to asset icon
  address?: string; // User's deposit address for this asset
}

interface Transaction {
  id: string;
  date: string;
  type: 'Deposit' | 'Withdrawal' | 'TradeBuy' | 'TradeSell' | 'StakingReward';
  assetSymbol: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  fromAddress?: string;
  toAddress?: string;
  txHash?: string;
}

interface SavedAddress {
    id: string;
    label: string;
    assetSymbol: string;
    address: string;
}

const WalletManagementPage: React.FC = () => {
  console.log('WalletManagementPage loaded');

  const [isDepositDialogOpen, setDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [isAddressBookOpen, setAddressBookOpen] = useState(false);
  const [selectedAssetForTx, setSelectedAssetForTx] = useState<Asset | null>(null);
  const [transactionSearchTerm, setTransactionSearchTerm] = useState('');

  // Placeholder Data
  const totalBalanceUSD = 67500.75;

  const assets: Asset[] = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', balance: 1.25, valueUSD: 50000.50, color: '#F7931A', iconUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', balance: 10.5, valueUSD: 15000.25, color: '#627EEA', iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029', address: '0x0123456789abcdef0123456789abcdef01234567' },
    { id: 'usdt', name: 'Tether', symbol: 'USDT', balance: 2500.00, valueUSD: 2500.00, color: '#26A17B', iconUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=029', address: '0xTetherAddress0123456789abcdef0123456789' },
  ];

  const transactions: Transaction[] = [
    { id: 'tx1', date: '2024-08-15 10:30', type: 'Deposit', assetSymbol: 'BTC', amount: 0.05, status: 'Completed', toAddress: assets[0].address, txHash: '0xabc...' },
    { id: 'tx2', date: '2024-08-14 14:20', type: 'Withdrawal', assetSymbol: 'ETH', amount: 1.5, status: 'Completed', toAddress: '0xExternalWithdrawalAddr', txHash: '0xdef...' },
    { id: 'tx3', date: '2024-08-13 09:00', type: 'TradeBuy', assetSymbol: 'BTC', amount: 0.02, status: 'Completed' },
    { id: 'tx4', date: '2024-08-16 11:00', type: 'Deposit', assetSymbol: 'USDT', amount: 500, status: 'Pending', toAddress: assets[2].address, txHash: '0xghi...' },
  ];

  const savedAddresses: SavedAddress[] = [
    { id: 'addr1', label: 'My Binance ETH', assetSymbol: 'ETH', address: '0xBinanceDeposit0123456789abcdef' },
    { id: 'addr2', label: 'Friend BTC Wallet', assetSymbol: 'BTC', address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy' },
  ];
  
  const [currentWithdrawAmount, setCurrentWithdrawAmount] = useState<string>('');
  const [currentWithdrawAddress, setCurrentWithdrawAddress] = useState<string>('');


  const assetAllocationData = assets.map(asset => ({
    name: asset.symbol,
    value: asset.valueUSD,
    fill: asset.color,
  }));

  const filteredTransactions = useMemo(() => {
    if (!transactionSearchTerm) return transactions;
    return transactions.filter(tx =>
      tx.assetSymbol.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
      tx.type.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
      tx.status.toLowerCase().includes(transactionSearchTerm.toLowerCase())
    );
  }, [transactions, transactionSearchTerm]);

  const handleDeposit = (asset: Asset) => {
    setSelectedAssetForTx(asset);
    setDepositDialogOpen(true);
  };

  const handleWithdraw = (asset: Asset) => {
    setSelectedAssetForTx(asset);
    setCurrentWithdrawAmount('');
    setCurrentWithdrawAddress('');
    setWithdrawDialogOpen(true);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Potentially show a toast notification here
      console.log("Copied to clipboard:", text);
    }).catch(err => {
      console.error("Failed to copy:", err);
    });
  };


  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100 pb-16">
      <DynamicScreenHeader title="My Wallet" headerActions={
          <Button variant="ghost" size="icon" onClick={() => setAddressBookOpen(true)} aria-label="Open Address Book">
            <BookUser className="h-5 w-5 text-yellow-400" />
          </Button>
      } />

      <ScrollArea className="flex-1">
        <main className="p-4 space-y-6">
          {/* Total Balance Overview */}
          <GlassmorphismTradingCard padding="p-6" className="text-center">
            <p className="text-sm text-neutral-400 mb-1">Total Portfolio Value</p>
            <AnimatedNumericDisplay value={totalBalanceUSD} prefix="$" precision={2} className="text-4xl font-bold text-white" />
          </GlassmorphismTradingCard>

          {/* Quick Actions (Deposit/Withdraw for primary assets) */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10 py-6 text-base" onClick={() => handleDeposit(assets[0])}> {/* Default to first asset or a general deposit */}
              <Download className="mr-2 h-5 w-5" /> Deposit
            </Button>
            <Button variant="outline" className="text-red-400 border-red-400/50 hover:bg-red-400/10 py-6 text-base" onClick={() => handleWithdraw(assets[0])}> {/* Default to first asset or a general withdraw */}
              <Upload className="mr-2 h-5 w-5" /> Withdraw
            </Button>
          </div>
          
          {/* Asset Allocation Pie Chart */}
          <Card className="bg-neutral-900/80 border-neutral-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-neutral-200 text-lg">Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] md:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={window.innerWidth < 768 ? 70 : 100} // Smaller radius for mobile
                    fill="#8884d8"
                    dataKey="value"
                    stroke="none"
                  >
                    {assetAllocationData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '0.5rem', color: '#e5e5e5' }}
                    formatter={(value: number, name: string) => [`$${value.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`, name]}
                  />
                  <Legend wrapperStyle={{fontSize: '12px'}} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Individual Asset Balances */}
          <Card className="bg-neutral-900/80 border-neutral-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-neutral-200 text-lg">My Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assets.map(asset => (
                <GlassmorphismTradingCard key={asset.id} padding="p-4" className="flex items-center justify-between hover:border-yellow-400/50 transition-colors duration-200">
                  <div className="flex items-center">
                    {asset.iconUrl && <img src={asset.iconUrl} alt={asset.name} className="w-8 h-8 mr-3 rounded-full bg-white/10 p-0.5" />}
                    <div>
                      <p className="font-semibold text-neutral-100">{asset.name} <span className="text-xs text-neutral-400">({asset.symbol})</span></p>
                      <AnimatedNumericDisplay value={asset.balance} precision={asset.symbol === 'USDT' ? 2 : 6} className="text-sm text-neutral-300" />
                    </div>
                  </div>
                  <div className="text-right">
                     <AnimatedNumericDisplay value={asset.valueUSD} prefix="$" precision={2} className="font-semibold text-neutral-100" />
                     <div className="flex gap-1 mt-1 justify-end">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-400 hover:text-yellow-300" onClick={() => handleDeposit(asset)}><Download className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-400 hover:text-red-300" onClick={() => handleWithdraw(asset)}><Upload className="h-4 w-4" /></Button>
                     </div>
                  </div>
                </GlassmorphismTradingCard>
              ))}
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="bg-neutral-900/80 border-neutral-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-neutral-200 text-lg">Transaction History</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  value={transactionSearchTerm}
                  onChange={(e) => setTransactionSearchTerm(e.target.value)}
                  className="pl-8 bg-neutral-800 border-neutral-700 placeholder:text-neutral-500 focus:border-yellow-400"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-neutral-800">
                        <TableHead className="text-neutral-400">Asset</TableHead>
                        <TableHead className="text-neutral-400">Type</TableHead>
                        <TableHead className="text-neutral-400 text-right">Amount</TableHead>
                        <TableHead className="text-neutral-400">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((tx) => (
                        <TableRow key={tx.id} className="border-neutral-800">
                          <TableCell>
                            <div className="font-medium text-neutral-100">{tx.assetSymbol}</div>
                            <div className="text-xs text-neutral-500">{new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}</div>
                          </TableCell>
                          <TableCell className="text-neutral-300">{tx.type}</TableCell>
                          <TableCell className={`text-right font-medium ${tx.type.includes('Deposit') || tx.type.includes('Buy') ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.type.includes('Deposit') || tx.type.includes('Buy') ? '+' : '-'}
                            <AnimatedNumericDisplay value={tx.amount} precision={tx.assetSymbol === 'USDT' ? 2 : 6} />
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={tx.status === 'Completed' ? 'default' : (tx.status === 'Pending' ? 'secondary' : 'destructive')}
                              className={`capitalize ${
                                tx.status === 'Completed' ? 'bg-green-600/20 text-green-400 border-green-600/30' :
                                tx.status === 'Pending' ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30' :
                                'bg-red-600/20 text-red-400 border-red-600/30'
                              }`}
                            >
                              {tx.status}
                            </Badge>
                            {tx.txHash && (
                               <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-neutral-500 hover:text-yellow-300" onClick={() => window.open(`https://etherscan.io/tx/${tx.txHash}`, '_blank')}>
                                  <ExternalLink className="h-3 w-3"/>
                               </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-neutral-500 py-8">No transactions found.</p>
              )}
            </CardContent>
          </Card>
        </main>
      </ScrollArea>

      {/* Deposit Dialog */}
      <Dialog open={isDepositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <DialogHeader>
            <DialogTitle className="text-yellow-400">Deposit {selectedAssetForTx?.symbol}</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Send only {selectedAssetForTx?.symbol} to this address. Sending any other coin may result in permanent loss.
            </DialogDescription>
          </DialogHeader>
          {selectedAssetForTx && (
            <div className="py-4 space-y-4 text-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${selectedAssetForTx.address}&bgcolor=171717&color=eab308&format=svg`}
                alt={`${selectedAssetForTx.symbol} Deposit QR Code`}
                className="mx-auto rounded-lg border-4 border-neutral-700"
              />
              <p className="text-sm text-neutral-300 break-all bg-neutral-800 p-3 rounded-md">
                {selectedAssetForTx.address}
              </p>
              <Button variant="outline" className="w-full text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10" onClick={() => copyToClipboard(selectedAssetForTx.address || '')}>
                <Copy className="mr-2 h-4 w-4" /> Copy Address
              </Button>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDepositDialogOpen(false)} className="text-neutral-400 hover:text-neutral-100">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <DialogHeader>
            <DialogTitle className="text-red-400">Withdraw {selectedAssetForTx?.symbol}</DialogTitle>
            {selectedAssetForTx && <DialogDescription className="text-neutral-400">Available: <AnimatedNumericDisplay value={selectedAssetForTx.balance} /> {selectedAssetForTx.symbol}</DialogDescription>}
          </DialogHeader>
          {selectedAssetForTx && (
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="withdraw-address" className="text-neutral-300">Recipient {selectedAssetForTx.symbol} Address</Label>
                <Input id="withdraw-address" placeholder={`Enter ${selectedAssetForTx.symbol} address`} value={currentWithdrawAddress} onChange={e => setCurrentWithdrawAddress(e.target.value)} className="bg-neutral-800 border-neutral-700 placeholder:text-neutral-500 mt-1" />
              </div>
              <div>
                <Label htmlFor="withdraw-amount" className="text-neutral-300">Amount</Label>
                <Input id="withdraw-amount" type="number" placeholder="0.00" value={currentWithdrawAmount} onChange={e => setCurrentWithdrawAmount(e.target.value)} className="bg-neutral-800 border-neutral-700 placeholder:text-neutral-500 mt-1" />
                {/* Add network selection if applicable */}
              </div>
              <p className="text-xs text-neutral-500">Note: Withdrawal fees and network confirmations apply.</p>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={() => setWithdrawDialogOpen(false)} className="text-neutral-400 hover:text-neutral-100">Cancel</Button>
            <Button 
                onClick={() => { /* Implement withdrawal logic here */ console.log('Withdraw clicked', selectedAssetForTx, currentWithdrawAmount, currentWithdrawAddress); setWithdrawDialogOpen(false);}} 
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={!currentWithdrawAddress || !currentWithdrawAmount || parseFloat(currentWithdrawAmount) <= 0 || parseFloat(currentWithdrawAmount) > (selectedAssetForTx?.balance || 0)}
            >
                Confirm Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Address Book Dialog */}
      <Dialog open={isAddressBookOpen} onOpenChange={setAddressBookOpen}>
          <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100 max-w-md w-[95vw]">
              <DialogHeader>
                  <DialogTitle className="text-yellow-400">Address Book</DialogTitle>
                  <DialogDescription className="text-neutral-400">Manage your saved cryptocurrency addresses.</DialogDescription>
              </DialogHeader>
              <div className="py-4 max-h-[60vh] overflow-y-auto space-y-3">
                  {savedAddresses.map(addr => (
                      <GlassmorphismTradingCard key={addr.id} padding="p-3" className="flex items-center justify-between">
                          <div>
                              <p className="font-semibold text-neutral-100">{addr.label} <span className="text-xs text-neutral-400">({addr.assetSymbol})</span></p>
                              <p className="text-xs text-neutral-300 break-all">{addr.address}</p>
                          </div>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-yellow-300" onClick={() => copyToClipboard(addr.address)}><Copy className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-red-400" onClick={() => {/* Implement delete */ console.log("Delete address", addr.id)}}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                      </GlassmorphismTradingCard>
                  ))}
                  {savedAddresses.length === 0 && <p className="text-neutral-500 text-center py-4">No saved addresses yet.</p>}
              </div>
              <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10 w-full sm:w-auto" onClick={() => {/* Implement add new address */ console.log("Add new address clicked")}}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
                  </Button>
                  <Button variant="ghost" onClick={() => setAddressBookOpen(false)} className="text-neutral-400 hover:text-neutral-100 w-full sm:w-auto">Close</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      <AppBottomTabBar />
    </div>
  );
};

export default WalletManagementPage;