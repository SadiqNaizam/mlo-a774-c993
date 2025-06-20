import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Though not heavily used here, good practice for potential links.

// Custom Components
import AppBottomTabBar from '@/components/layout/AppBottomTabBar';
import DynamicScreenHeader from '@/components/layout/DynamicScreenHeader';
import AdvancedLeverageSlider from '@/components/AdvancedLeverageSlider';
import AnimatedNumericDisplay from '@/components/AnimatedNumericDisplay';

// Shadcn/UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form as ShadcnForm, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Aliased to avoid conflict
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// React Hook Form & Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, Info } from 'lucide-react'; // Icons for alerts or info

// Recharts & Shadcn Chart Components
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define Zod schema for the Spot trading form
const spotFormSchema = z.object({
  orderType: z.enum(['market', 'limit'], { required_error: "Order type is required." }),
  price: z.string().optional(), // Price is optional for market orders
  amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number.",
  }),
}).refine(data => {
  if (data.orderType === 'limit') {
    return data.price && !isNaN(parseFloat(data.price)) && parseFloat(data.price) > 0;
  }
  return true;
}, {
  message: "Price is required for limit orders and must be positive.",
  path: ["price"], // Point error to price field
});

type SpotFormValues = z.infer<typeof spotFormSchema>;

// Placeholder for NeumorphicInteractiveElement (as a styled wrapper)
const NeumorphicButtonWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-neutral-800 p-0.5 rounded-lg shadow-[inset_3px_3px_6px_#1e1e1e,inset_-3px_-3px_6px_#4a4a4a] ${className}`}>
    {children}
  </div>
);

// Mock price data for the chart
const mockChartData = [
  { date: 'Jan', price: 60000 },
  { date: 'Feb', price: 61500 },
  { date: 'Mar', price: 63000 },
  { date: 'Apr', price: 62000 },
  { date: 'May', price: 65000 },
  { date: 'Jun', price: 64000 },
  { date: 'Jul', price: 66000 },
  { date: 'Aug', price: 68050.12 }, // Current price from HomeDashboardPage for consistency
];

const chartConfig = {
  price: {
    label: "BTC Price (USDT)",
    color: "hsl(var(--primary))", // Use primary theme color
  },
};


const TradingInterfacePage = () => {
  console.log('TradingInterfacePage loaded');

  const [activeTab, setActiveTab] = useState<'spot' | 'futures' | 'options'>('spot');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [submittedOrderData, setSubmittedOrderData] = useState<any>(null);
  
  // For Futures Tab Leverage
  const [currentLeverage, setCurrentLeverage] = useState(10);

  // Spot Trading Form
  const spotForm = useForm<SpotFormValues>({
    resolver: zodResolver(spotFormSchema),
    defaultValues: {
      orderType: 'limit',
      price: '',
      amount: '',
    },
  });
  const spotOrderType = spotForm.watch('orderType');
  const spotPrice = spotForm.watch('price') || "0";
  const spotAmount = spotForm.watch('amount') || "0";
  const spotCalculatedTotal = (parseFloat(spotPrice) || 0) * (parseFloat(spotAmount) || 0);

  const handleSpotSubmit = (data: SpotFormValues) => {
    console.log('Spot Order Submitted:', data);
    setSubmittedOrderData({ ...data, type: 'Spot', pair: 'BTC/USDT' });
    setIsConfirmDialogOpen(true);
    spotForm.reset(); // Reset form after submission
  };

  // Placeholder submit for futures
  const handleFuturesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Futures Order Submitted (Placeholder)');
    setSubmittedOrderData({ type: 'Futures', pair: 'BTC/USDT', leverage: currentLeverage, price: 'Market', amount: '0.1' });
    setIsConfirmDialogOpen(true);
  };
  
  const renderTradeForm = (tradeType: 'spot' | 'futures' | 'options') => {
    if (tradeType === 'options') {
      return <p className="text-neutral-400 text-center py-8 h-full flex items-center justify-center">Options Trading Interface (Placeholder)</p>;
    }

    if (tradeType === 'spot') {
      return (
        <ShadcnForm {...spotForm}>
          <form onSubmit={spotForm.handleSubmit(handleSpotSubmit)} className="space-y-3 text-sm h-full flex flex-col">
            <FormField
              control={spotForm.control}
              name="orderType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300">Order Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400">
                        <SelectValue placeholder="Select order type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-neutral-700 border-neutral-600 text-white">
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="limit">Limit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {spotOrderType === 'limit' && (
              <FormField
                control={spotForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-300">Price (USDT)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} className="bg-neutral-700 border-neutral-600 placeholder:text-neutral-500 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={spotForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300">Amount (BTC)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} className="bg-neutral-700 border-neutral-600 placeholder:text-neutral-500 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-1.5">
              {['25%', '50%', '75%', '100%'].map(pct => (
                <Button key={pct} type="button" variant="outline" size="sm" className="flex-1 border-neutral-600 hover:bg-neutral-600 text-neutral-300 text-xs h-7" onClick={() => console.log(`Spot: Set amount to ${pct}`)}>{pct}</Button>
              ))}
            </div>

            <div className="pt-1 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Available:</span>
                <span>1.2345 USDT</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Total:</span>
                <AnimatedNumericDisplay value={spotCalculatedTotal} precision={2} prefix="" suffix=" USDT" className="font-medium text-neutral-200" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2 mt-auto"> {/* mt-auto pushes buttons to bottom */}
              <NeumorphicButtonWrapper>
                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold h-10">Buy BTC</Button>
              </NeumorphicButtonWrapper>
              <NeumorphicButtonWrapper>
                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold h-10">Sell BTC</Button>
              </NeumorphicButtonWrapper>
            </div>
          </form>
        </ShadcnForm>
      );
    }

    if (tradeType === 'futures') {
        // Simplified form for futures, can be expanded like spot
        const futuresPrice = "29500.50"; // Example
        const futuresAmount = "0.1"; // Example
        const futuresCalculatedNotional = (parseFloat(futuresPrice) || 0) * (parseFloat(futuresAmount) || 0);


      return (
        <form onSubmit={handleFuturesSubmit} className="space-y-3 text-sm h-full flex flex-col">
            <FormItem>
                <FormLabel className="text-neutral-300">Order Type</FormLabel>
                 <Select defaultValue="limit">
                    <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400">
                        <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-700 border-neutral-600 text-white">
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="stop-limit">Stop-Limit</SelectItem>
                    </SelectContent>
                </Select>
            </FormItem>
             <FormItem>
                <FormLabel className="text-neutral-300">Price (USDT)</FormLabel>
                <Input type="number" placeholder="0.00" defaultValue={futuresPrice} className="bg-neutral-700 border-neutral-600 placeholder:text-neutral-500 text-white" />
            </FormItem>
            <FormItem>
                <FormLabel className="text-neutral-300">Amount (BTC)</FormLabel>
                <Input type="number" placeholder="0.00" defaultValue={futuresAmount} className="bg-neutral-700 border-neutral-600 placeholder:text-neutral-500 text-white" />
            </FormItem>

            <AdvancedLeverageSlider
              currentLeverage={currentLeverage}
              onLeverageChange={setCurrentLeverage}
              notionalTradeValue={futuresCalculatedNotional * currentLeverage} // Total position value with leverage
              assetSymbol="USDT"
              minLeverage={1}
              maxLeverage={125}
              className="my-3"
            />
             <div className="pt-1 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Cost:</span>
                 <AnimatedNumericDisplay value={futuresCalculatedNotional} precision={2} suffix=" USDT" className="font-medium text-neutral-200" />
              </div>
               <div className="flex justify-between text-neutral-400">
                <span>Max Position:</span>
                 <AnimatedNumericDisplay value={futuresCalculatedNotional * currentLeverage} precision={2} suffix=" USDT" className="font-medium text-neutral-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 mt-auto">
               <NeumorphicButtonWrapper>
                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold h-10">Buy / Long</Button>
              </NeumorphicButtonWrapper>
              <NeumorphicButtonWrapper>
                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold h-10">Sell / Short</Button>
              </NeumorphicButtonWrapper>
            </div>
        </form>
      );
    }
    return null;
  };


  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white">
      <DynamicScreenHeader title="BTC/USDT" showBackButton={false} headerActions={
        <Button variant="ghost" size="icon" className="text-neutral-300 hover:text-white"><Info size={20}/></Button>
      } />
      
      {/* Main Content Area with Split Layout */}
      <ScrollArea className="flex-1 mb-16"> {/* mb-16 for bottom tab bar space */}
        <div className="p-2 md:p-4 flex flex-col lg:flex-row gap-2 md:gap-4">
          {/* Left Side: Chart and Order Book */}
          <div className="lg:w-2/3 flex flex-col gap-2 md:gap-4">
            {/* InteractiveMarketChart */}
            <Card className="flex-grow min-h-[250px] md:min-h-[350px] bg-neutral-800/70 border-neutral-700/50 backdrop-blur-sm">
              <CardContent className="p-1 md:p-2 h-full">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      accessibilityLayer
                      data={mockChartData}
                      margin={{
                        top: 5,
                        right: 20,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.3)" />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                        stroke="hsl(var(--muted-foreground))"
                        className="text-xs"
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        orientation="right"
                        tickFormatter={(value) => `$${(value / 1000)}k`}
                        stroke="hsl(var(--muted-foreground))"
                        className="text-xs"
                      />
                      <ChartTooltip
                        cursor={true}
                        content={<ChartTooltipContent indicator="line" labelClassName="text-background" className="bg-neutral-100 text-neutral-900" />}
                      />
                      <Line
                        dataKey="price"
                        type="monotone"
                        strokeWidth={2}
                        stroke={chartConfig.price.color}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            {/* OrderBookVisualizer Placeholder */}
            <Card className="h-[180px] md:h-[220px] bg-neutral-800/70 border-neutral-700/50 backdrop-blur-sm">
              <CardHeader className="py-2 px-3 md:py-3 md:px-4">
                <CardTitle className="text-sm md:text-base font-medium text-neutral-200">Order Book</CardTitle>
              </CardHeader>
              <CardContent className="p-1 md:p-2 flex items-center justify-center">
                <p className="text-neutral-400 text-xs md:text-sm">Order Book Visualization (Bids & Asks)</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Trading Form and Controls */}
          <div className="lg:w-1/3 flex flex-col">
            <Card className="flex-grow bg-neutral-800/70 border-neutral-700/50 backdrop-blur-sm">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'spot' | 'futures' | 'options')} className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3 bg-neutral-700/80 rounded-t-md rounded-b-none sticky top-0 z-10">
                  <TabsTrigger value="spot" className="data-[state=active]:bg-neutral-600 data-[state=active]:text-white">Spot</TabsTrigger>
                  <TabsTrigger value="futures" className="data-[state=active]:bg-neutral-600 data-[state=active]:text-white">Futures</TabsTrigger>
                  <TabsTrigger value="options" className="data-[state=active]:bg-neutral-600 data-[state=active]:text-white">Options</TabsTrigger>
                </TabsList>
                <TabsContent value="spot" className="flex-grow p-2 md:p-3">
                  {renderTradeForm('spot')}
                </TabsContent>
                <TabsContent value="futures" className="flex-grow p-2 md:p-3">
                  {renderTradeForm('futures')}
                </TabsContent>
                <TabsContent value="options" className="flex-grow p-2 md:p-3">
                  {renderTradeForm('options')}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
        
        {/* GestureTradeInputPad Placeholder */}
        <div className="px-2 md:px-4 mt-2 md:mt-4">
            <Card className="p-3 md:p-4 border border-dashed border-neutral-600/50 rounded-md text-center bg-neutral-800/50">
                <p className="text-neutral-500 text-sm">GestureTradeInputPad Area (Placeholder)</p>
            </Card>
        </div>

        {/* Open Orders / Positions Placeholder */}
        <div className="px-2 md:px-4 my-2 md:my-4">
            <Card className="bg-neutral-800/70 border-neutral-700/50 backdrop-blur-sm">
                <CardHeader className="py-2 px-3 md:py-3 md:px-4">
                    <CardTitle className="text-sm md:text-base font-medium text-neutral-200">Open Orders / Positions</CardTitle>
                </CardHeader>
                <CardContent className="p-2 md:p-3 min-h-[80px] flex items-center justify-center">
                    <p className="text-neutral-400 text-xs md:text-sm">List of open orders and current positions will appear here.</p>
                </CardContent>
            </Card>
        </div>
      </ScrollArea>

      <AppBottomTabBar />

      {/* Order Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>\n        <DialogContent className="bg-neutral-800 border-neutral-700 text-white">\n          <DialogHeader>\n            <DialogTitle>Order Confirmation</DialogTitle>\n            <DialogDescription className="text-neutral-400">\n              Your order has been submitted.\n            </DialogDescription>\n          </DialogHeader>\n          {submittedOrderData && (\n            <div className="text-sm space-y-1 mt-2">\n              <p><strong>Type:</strong> {submittedOrderData.type}</p>\n              <p><strong>Pair:</strong> {submittedOrderData.pair}</p>\n              {submittedOrderData.orderType && <p><strong>Order Type:</strong> {submittedOrderData.orderType}</p>}\n              {submittedOrderData.price && <p><strong>Price:</strong> {submittedOrderData.price} USDT</p>}\n              <p><strong>Amount:</strong> {submittedOrderData.amount} BTC</p>\n              {submittedOrderData.leverage && <p><strong>Leverage:</strong> {submittedOrderData.leverage}x</p>}\n            </div>\n          )}\n          <DialogFooter className="mt-4">\n            <Button onClick={() => setIsConfirmDialogOpen(false)} className="bg-blue-500 hover:bg-blue-600">OK</Button>\n          </DialogFooter>\n        </DialogContent>\n      </Dialog>\n    </div>\n  );\n};\n\nexport default TradingInterfacePage;