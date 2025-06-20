import React from 'react';
import { Link } from 'react-router-dom';

// Custom Layout Components
import AppBottomTabBar from '@/components/layout/AppBottomTabBar';
import DynamicScreenHeader from '@/components/layout/DynamicScreenHeader';

// Custom UI Components
import ParticleEffectBackgroundView from '@/components/ParticleEffectBackgroundView';
import ModularDashboardWidget from '@/components/ModularDashboardWidget';
import GlassmorphismTradingCard from '@/components/GlassmorphismTradingCard';
import AnimatedNumericDisplay from '@/components/AnimatedNumericDisplay';

// Shadcn/ui Components
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

// Icons (optional, for illustrative purposes if needed)
import { TrendingUp, Newspaper, DollarSign, Zap, AreaChart } from 'lucide-react';

// Recharts & Shadcn Chart Components
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


// Placeholder Data
const portfolioBalance = 28750.92;

const marketMoversData = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 68050.12, change: '+3.1%', trend: 'up' as 'up' | 'down', to: '/trading-interface?pair=BTC/USDT', iconColor: 'text-orange-400' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3512.78, change: '-0.8%', trend: 'down' as 'up' | 'down', to: '/trading-interface?pair=ETH/USDT', iconColor: 'text-sky-400' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', price: 172.45, change: '+6.5%', trend: 'up' as 'up' | 'down', to: '/trading-interface?pair=SOL/USDT', iconColor: 'text-purple-400' },
  { id: 'bnb', name: 'BNB', symbol: 'BNB', price: 601.00, change: '+1.2%', trend: 'up' as 'up' | 'down', to: '/trading-interface?pair=BNB/USDT', iconColor: 'text-yellow-400' },
];

const newsData = [
  { id: '1', title: 'Global Crypto Adoption Surges, Report Finds', source: 'Crypto International', impact: 'Bullish', time: '30m ago', icon: Newspaper },
  { id: '2', title: 'New Layer-2 Scaling Solution Goes Live', source: 'ETH Network News', impact: 'Positive', time: '2h ago', icon: Zap },
  { id: '3', title: 'Central Bank Digital Currency (CBDC) Pilots Expanding', source: 'Global Finance Monitor', impact: 'Neutral', time: '5h ago', icon: DollarSign },
];

const portfolioTrendData = [
  { month: "Jan", value: 25000 },
  { month: "Feb", value: 26500 },
  { month: "Mar", value: 25800 },
  { month: "Apr", value: 27200 },
  { month: "May", value: 28000 },
  { month: "Jun", value: portfolioBalance }, // Current balance
];

const portfolioChartConfig = {
  value: {
    label: "Portfolio Value (USD)",
    color: "hsl(var(--primary))",
  },
};


const HomeDashboardPage: React.FC = () => {
  console.log('HomeDashboardPage loaded');

  return (
    <>
      <ParticleEffectBackgroundView 
        className="fixed inset-0 -z-10" 
        particleCount={70}
        baseColor="rgba(150, 150, 200, 0.4)"
        particleSpeed={0.3}
        mouseInteractionRadius={80}
      />
      <div className="flex flex-col min-h-screen bg-neutral-950/80 text-neutral-100">
        <DynamicScreenHeader 
          title="Dashboard" 
          transparentMode={true} 
          // headerActions={<UserAvatar />} // Example: placeholder for user avatar/settings
        />
        
        {/* pt-16 for header height, pb-20 for tab bar height + padding */}
        <ScrollArea className="flex-1 pt-16 pb-20">
          <main className="container mx-auto px-4 py-6 space-y-6">
            {/* Portfolio Overview Widget */}
            <ModularDashboardWidget widgetId=\"portfolio\" title=\"My Portfolio\" description=\"Total estimated value\">
              <div className=\"text-center py-4\">\n                <AnimatedNumericDisplay 
                  value={portfolioBalance} 
                  precision={2} 
                  prefix=\"$\" 
                  className=\"text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400\" 
                />
                <div className=\"mt-3\">\n                  <Link to=\"/wallet-management\">\n                    <Button variant=\"ghost\" className=\"text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10\">\n                      View Wallet\n                    </Button>\n                  </Link>\n                </div>\n              </div>\n            </ModularDashboardWidget>

            {/* Portfolio Trend Widget */}
            <ModularDashboardWidget widgetId="portfolio-trend" title="Portfolio Trend" description="Last 6 months performance">
              <div className="h-[200px] py-4">
                <ChartContainer config={portfolioChartConfig} className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      accessibilityLayer
                      data={portfolioTrendData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: -20, // Adjust to make Y-axis labels visible if needed
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        stroke="hsl(var(--muted-foreground))"
                        className="text-xs"
                      />
                      <YAxis
                        dataKey="value"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `$${value / 1000}k`}
                        stroke="hsl(var(--muted-foreground))"
                        className="text-xs"
                      />
                       <ChartTooltip
                        cursor={true}
                        content={<ChartTooltipContent indicator="line" labelClassName="text-background" className="bg-neutral-100 text-neutral-900" />}
                      />
                      <Line
                        dataKey="value"
                        type="monotone"
                        strokeWidth={2}
                        stroke={portfolioChartConfig.value.color}
                        dot={{
                          r: 4,
                          fill: portfolioChartConfig.value.color,
                          stroke: "hsl(var(--background))",
                          strokeWidth: 2,
                        }}
                        activeDot={{
                            r: 6,
                            fill: portfolioChartConfig.value.color,
                            stroke: "hsl(var(--background))",
                            strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </ModularDashboardWidget>

            {/* Market Movers Widget */}
            <ModularDashboardWidget widgetId=\"market-movers\" title=\"Market Movers\" description=\"Top trending assets\">\n              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n                {marketMoversData.map((coin) => (\n                  <Link to={coin.to} key={coin.id} className=\"block\">\n                    <GlassmorphismTradingCard className=\"hover:ring-2 hover:ring-yellow-400/70 transition-all duration-200 ease-in-out cursor-pointer\" padding=\"p-4\">\n                      <div className=\"flex items-center justify-between\">\n                        <h3 className=\"text-lg font-semibold text-white\">{coin.name} <span className=\"text-sm text-neutral-400\">({coin.symbol})</span></h3>\n                        <TrendingUp className={`w-6 h-6 ${coin.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />\n                      </div>\n                      <AnimatedNumericDisplay \n                        value={coin.price} \n                        prefix=\"$\" \n                        precision={2} \n                        className={`text-2xl mt-1 ${coin.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} \n                      />\n                      <p className={`text-sm font-medium mt-0.5 ${coin.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>{coin.change}</p>\n                    </GlassmorphismTradingCard>\n                  </Link>\n                ))}\n              </div>\n              <div className=\"mt-4 text-center\">\n                <Link to=\"/markets\">\n                  <Button variant=\"outline\" className=\"border-neutral-600 text-neutral-300 hover:bg-neutral-700/50 hover:text-white\">\n                    View All Markets\n                  </Button>\n                </Link>\n              </div>\n            </ModularDashboardWidget>\n\n            {/* News Feed Widget */}\n            <ModularDashboardWidget widgetId=\"news\" title=\"Latest News\" description=\"Stay updated with market insights\">\n              <div className=\"space-y-3 max-h-96 overflow-y-auto pr-1\"> {/* Added scroll for news if many */}\n                {newsData.map((item) => {\n                  const Icon = item.icon;\n                  return (\n                    <GlassmorphismTradingCard key={item.id} padding=\"p-4\" className=\"bg-black/30 border-white/5\">\n                      <div className=\"flex items-start space-x-3\">\n                        <Icon className=\"w-5 h-5 mt-0.5 text-yellow-400 flex-shrink-0\" />\n                        <div>\n                          <h4 className=\"font-semibold text-sm text-neutral-100\">{item.title}</h4>\n                          <p className=\"text-xs text-neutral-400\">{item.source} - {item.time}</p>\n                          <span className={`text-xs px-1.5 py-0.5 rounded-full mt-1 inline-block ${item.impact === 'Bullish' || item.impact === 'Positive' ? 'bg-green-500/20 text-green-400' : item.impact === 'Neutral' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>\n                            {item.impact}\n                          </span>\n                        </div>\n                      </div>\n                    </GlassmorphismTradingCard>\n                  );\n                })}\n              </div>\n            </ModularDashboardWidget>\n\n            {/* Quick Actions Widget */}\n            <ModularDashboardWidget widgetId=\"quick-actions\" title=\"Quick Actions\">\n              <div className=\"grid grid-cols-2 gap-3\">\n                <Link to=\"/trading-interface\">\n                  <Button variant=\"default\" className=\"w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-semibold py-3\">\n                    Quick Trade\n                  </Button>\n                </Link>\n                <Link to=\"/earn-section\">\n                  <Button variant=\"outline\" className=\"w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 font-semibold py-3\">\n                    Explore Earn\n                  </Button>\n                </Link>\n              </div>\n            </ModularDashboardWidget>\n\n          </main>\n        </ScrollArea>\n        <AppBottomTabBar />\n      </div>\n    </>\n  );\n};\n\nexport default HomeDashboardPage;