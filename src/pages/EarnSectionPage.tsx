import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import AppBottomTabBar from '@/components/layout/AppBottomTabBar';
import DynamicScreenHeader from '@/components/layout/DynamicScreenHeader';
import HolographicDisplayElement from '@/components/HolographicDisplayElement';
import GlassmorphismTradingCard from '@/components/GlassmorphismTradingCard';

// Shadcn/UI Components
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Lucide Icons
import { PiggyBank, TrendingUp, Rocket, Zap, Leaf, Coins, Image as ImageIcon, Percent, ShieldCheck, CalendarDays, BarChartHorizontalBig } from 'lucide-react';

// Placeholder APY Calculator Input Group
interface APYCalculatorInputGroupProps {
  productId: string;
  defaultApy?: number;
  onCalculate: (details: { amount: number; apy: number; duration: number }) => void;
}

const APYCalculatorInputGroupPlaceholder: React.FC<APYCalculatorInputGroupProps> = ({ productId, defaultApy = 0, onCalculate }) => {
  const [amount, setAmount] = useState('');
  const [apy, setApy] = useState(defaultApy ? defaultApy.toString() : '');
  const [duration, setDuration] = useState('');
  const [calculatedEarnings, setCalculatedEarnings] = useState<number | null>(null);

  const handleCalculate = () => {
    const numAmount = parseFloat(amount);
    const numApy = parseFloat(apy);
    const numDuration = parseInt(duration, 10);

    if (!isNaN(numAmount) && !isNaN(numApy) && !isNaN(numDuration) && numDuration > 0) {
      const earnings = (numAmount * (numApy / 100) * (numDuration / 365));
      setCalculatedEarnings(earnings);
      onCalculate({ amount: numAmount, apy: numApy, duration: numDuration });
      console.log(`Calculated for ${productId}: Amount: ${numAmount}, APY: ${numApy}%, Duration: ${numDuration} days. Earnings: ${earnings.toFixed(2)}`);
    } else {
      setCalculatedEarnings(null);
      console.warn("Invalid input for APY calculation.");
    }
  };

  return (
    <div className="space-y-3 my-4 p-4 bg-neutral-800/70 rounded-lg border border-neutral-700">
      <h4 className="text-sm font-semibold text-neutral-200">Estimate Your Earnings</h4>
      <div className="space-y-2">
        <div>
          <Label htmlFor={`amount-${productId}`} className="text-xs text-neutral-400">Amount (USD)</Label>
          <Input id={`amount-${productId}`} type="number" placeholder="e.g., 1000" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500 h-10" />
        </div>
        <div>
          <Label htmlFor={`apy-${productId}`} className="text-xs text-neutral-400">Expected APY (%)</Label>
          <Input id={`apy-${productId}`} type="number" placeholder="e.g., 12.5" value={apy} onChange={(e) => setApy(e.target.value)} className="bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500 h-10" />
        </div>
        <div>
          <Label htmlFor={`duration-${productId}`} className="text-xs text-neutral-400">Duration (days)</Label>
          <Input id={`duration-${productId}`} type="number" placeholder="e.g., 90" value={duration} onChange={(e) => setDuration(e.target.value)} className="bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500 h-10" />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full bg-sky-500 hover:bg-sky-600 text-white h-10">Calculate</Button>
      {calculatedEarnings !== null && (
        <div className="mt-3 p-3 bg-sky-700/30 rounded-md text-center">
          <p className="text-xs text-sky-300">Estimated Earnings:</p>
          <p className="text-lg font-semibold text-sky-200">${calculatedEarnings.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};


// Sample Data
const stakingProducts = [
  { id: 'eth2', name: 'ETH 2.0 Staking', apy: 5.5, duration: 'Flexible', icon: TrendingUp, details: 'Stake your ETH and earn rewards while supporting the network. Compounding rewards.' },
  { id: 'atom', name: 'Cosmos (ATOM) Staking', apy: 12.0, duration: '21-day Unbonding', icon: ShieldCheck, details: 'Secure the Cosmos network and earn ATOM rewards. Subject to validator commissions.' },
  { id: 'sol', name: 'Solana (SOL) Staking', apy: 7.2, duration: 'Epoch-based', icon: Zap, details: 'Delegate your SOL to validators and earn staking rewards. Rewards distributed every epoch.' },
];

const savingsProducts = [
  { id: 'usdt-flex', name: 'USDT Flexible Savings', interestRate: 3.5, term: 'Flexible', icon: PiggyBank, details: 'Earn daily interest on your USDT with the flexibility to redeem anytime.' },
  { id: 'btc-fixed', name: 'BTC Fixed Term (90 days)', interestRate: 6.0, term: '90 Days', icon: CalendarDays, details: 'Lock your BTC for 90 days to enjoy a higher interest rate. Principal and interest paid at maturity.' },
];

const launchpadProjects = [
  { id: 'nova', name: 'Project Nova', description: 'Next-gen DeFi on a new L1 blockchain.', status: 'Subscription Open', progress: 75, target: '1,000,000 USDT', icon: Rocket, glowColor: "150, 100, 255" },
  { id: 'astra', name: 'Astra Finance', description: 'AI-powered asset management protocol.', status: 'Upcoming', progress: 0, target: '500,000 USDT', icon: BarChartHorizontalBig, glowColor: "50, 200, 220" },
];

const EarnSectionPage = () => {
  useEffect(() => {
    console.log('EarnSectionPage loaded');
  }, []);

  const handleApyCalculate = (details: { amount: number; apy: number; duration: number }) => {
    // This function would typically interact with a state or context for more complex logic
    console.log("APY Calculation triggered with details:", details);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100">
      <DynamicScreenHeader title="Earn Center" transparentMode={false} />

      <ScrollArea className="flex-grow mb-16"> {/* mb-16 for bottom tab bar */}
        <div className="container mx-auto px-4 py-6 space-y-8">

          {/* Staking Products Section */}
          <section>
            <div className="flex items-center mb-4">
              <TrendingUp className="w-7 h-7 mr-3 text-sky-400" />
              <h2 className="text-2xl font-semibold text-sky-400">Staking Products</h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {stakingProducts.map((product) => (
                <GlassmorphismTradingCard key={product.id} className="!p-0 overflow-hidden" padding="none">
                  <AccordionItem value={product.id} className="border-b-0">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline text-left">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <product.icon className="w-6 h-6 mr-3 text-sky-400 flex-shrink-0" />
                          <div>
                            <h3 className="text-md font-medium text-neutral-100">{product.name}</h3>
                            <p className="text-xs text-neutral-400">{product.duration}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-sky-500/20 text-sky-300 border-sky-500/30">
                          Up to {product.apy.toFixed(1)}% APY
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 pt-2 bg-black/10">
                      <p className="text-sm text-neutral-300 mb-3">{product.details}</p>
                      <APYCalculatorInputGroupPlaceholder productId={product.id} defaultApy={product.apy} onCalculate={handleApyCalculate} />
                      <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white mt-2">Stake Now</Button>
                    </AccordionContent>
                  </AccordionItem>
                </GlassmorphismTradingCard>
              ))}
            </Accordion>
          </section>

          {/* Savings Products Section */}
          <section>
            <div className="flex items-center mb-4">
              <PiggyBank className="w-7 h-7 mr-3 text-emerald-400" />
              <h2 className="text-2xl font-semibold text-emerald-400">Savings</h2>
            </div>
            <div className="space-y-4">
            {savingsProducts.map((product) => (
              <Card key={product.id} className="bg-neutral-900 border-neutral-700/60 text-neutral-100">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <product.icon className="w-6 h-6 mr-3 text-emerald-400" />
                      <CardTitle className="text-md text-neutral-100">{product.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      {product.interestRate.toFixed(1)}% APR
                    </Badge>
                  </div>
                  <CardDescription className="text-neutral-400 pt-1">{product.term}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-300 mb-4">{product.details}</p>
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Deposit</Button>
                </CardContent>
              </Card>
            ))}
            </div>
          </section>

          {/* Launchpad Section */}
          <section>
            <div className="flex items-center mb-4">
              <Rocket className="w-7 h-7 mr-3 text-purple-400" />
              <h2 className="text-2xl font-semibold text-purple-400">Launchpad</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {launchpadProjects.map((project) => (
                 <HolographicDisplayElement
                  key={project.id}
                  title={project.name}
                  description={project.status}
                  icon={project.icon}
                  glowColor={project.glowColor}
                  className="aspect-[4/3] sm:aspect-[4/3] max-w-full" // Adjusted aspect ratio
                >
                  <div className="w-full px-2">
                    <p className="text-xs text-slate-300/80 mb-2 line-clamp-2">{project.description}</p>
                    <Progress value={project.progress} className="w-full h-2.5 mb-1 bg-slate-700 [&>div]:bg-purple-500" />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{project.progress}% Funded</span>
                      <span>Target: {project.target}</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4 border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200">
                      {project.status === 'Upcoming' ? 'Learn More' : 'Participate'}
                    </Button>
                  </div>
                </HolographicDisplayElement>
              ))}
            </div>
          </section>
          
          {/* DeFi Yield Farming Section */}
          <section>
             <Card className="bg-neutral-900 border-neutral-700/60 text-neutral-100">
              <CardHeader>
                <div className="flex items-center">
                  <Leaf className="w-6 h-6 mr-3 text-green-400" />
                  <CardTitle className="text-lg text-green-400">DeFi Yield Farming</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-300 mb-3">
                  Explore integrated DeFi protocols to farm yields. Connect your wallet and discover various liquidity pools and farming opportunities with competitive returns.
                </p>
                <Button variant="secondary" className="w-full bg-green-600/20 hover:bg-green-500/30 text-green-300 border border-green-500/40">Explore DeFi Pools</Button>
              </CardContent>
            </Card>
          </section>

          {/* Liquidity Mining Section */}
          <section>
            <GlassmorphismTradingCard>
              <div className="flex items-center mb-3">
                  <Coins className="w-6 h-6 mr-3 text-yellow-400" />
                  <h3 className="text-lg font-medium text-yellow-400">Liquidity Mining</h3>
              </div>
              <p className="text-sm text-neutral-300 mb-4">
                Provide liquidity to our integrated Automated Market Makers (AMMs) and earn rewards in the form of trading fees and bonus tokens.
              </p>
              <Button variant="outline" className="w-full border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20 hover:text-yellow-200">View Liquidity Pools</Button>
            </GlassmorphismTradingCard>
          </section>
          
          {/* NFT Staking Section */}
          <section>
            <GlassmorphismTradingCard>
                <div className="flex items-center mb-3">
                  <ImageIcon className="w-6 h-6 mr-3 text-pink-400" />
                  <h3 className="text-lg font-medium text-pink-400">NFT Staking</h3>
              </div>
              <p className="text-sm text-neutral-300 mb-4">
                Have valuable NFTs? Stake them here to earn passive income. Different collections offer varying APYs and reward tokens.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <img src="https://via.placeholder.com/150/FF0080/FFFFFF?Text=NFT+Art+1" alt="NFT 1" className="rounded-md aspect-square object-cover border-2 border-pink-500/30" />
                <img src="https://via.placeholder.com/150/AF00FF/FFFFFF?Text=NFT+Art+2" alt="NFT 2" className="rounded-md aspect-square object-cover border-2 border-pink-500/30" />
              </div>
              <Button variant="default" className="w-full bg-pink-500 hover:bg-pink-600 text-white">Stake Your NFTs</Button>
            </GlassmorphismTradingCard>
          </section>

        </div>
      </ScrollArea>

      <AppBottomTabBar />
    </div>
  );
};

export default EarnSectionPage;