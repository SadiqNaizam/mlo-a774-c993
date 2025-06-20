import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, TrendingUp, TrendingDown, Activity, DollarSign, Percent } from 'lucide-react';

// Custom Components
import AppBottomTabBar from '@/components/layout/AppBottomTabBar';
import DynamicScreenHeader from '@/components/layout/DynamicScreenHeader';
import AnimatedNumericDisplay from '@/components/AnimatedNumericDisplay';
import GlassmorphismTradingCard from '@/components/GlassmorphismTradingCard';
// HeatmapVisualizationComponent is listed in layout_info but not provided in custom_component_code.
// Will create a placeholder for it.

// Shadcn/ui Components
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  logoUrl?: string;
  isFavorite?: boolean;
}

const mockCryptoData: CryptoCurrency[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 60500.75, change24h: 2.5, marketCap: 1200000000000, volume24h: 35000000000, logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', isFavorite: true },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3000.20, change24h: -1.2, marketCap: 360000000000, volume24h: 20000000000, logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 150.50, change24h: 5.8, marketCap: 70000000000, volume24h: 5000000000, logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png', isFavorite: true },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB', price: 580.00, change24h: 0.5, marketCap: 85000000000, volume24h: 2000000000, logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', price: 0.15, change24h: -3.1, marketCap: 20000000000, volume24h: 1500000000, logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.45, change24h: 1.0, marketCap: 16000000000, volume24h: 800000000, logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png' },
];

const MarketsPage = () => {
  console.log('MarketsPage loaded');

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'gainers' | 'losers'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['bitcoin', 'solana'])); // Mock initial favorites

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(id)) {
        newFavs.delete(id);
      } else {
        newFavs.add(id);
      }
      return newFavs;
    });
  };
  
  const filteredData = useMemo(() => {
    let data = mockCryptoData.map(coin => ({ ...coin, isFavorite: favorites.has(coin.id) }));

    if (activeFilter === 'favorites') {
      data = data.filter(coin => coin.isFavorite);
    } else if (activeFilter === 'gainers') {
      data = data.filter(coin => coin.change24h > 0).sort((a, b) => b.change24h - a.change24h);
    } else if (activeFilter === 'losers') {
      data = data.filter(coin => coin.change24h < 0).sort((a, b) => a.change24h - b.change24h);
    }

    if (searchTerm) {
      data = data.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return data;
  }, [searchTerm, activeFilter, favorites]);

  const globalMarketStats = {
    totalMarketCap: 2350000000000,
    volume24h: 150000000000,
    btcDominance: 45.5,
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100">
      <DynamicScreenHeader title="Markets" className="bg-neutral-900 border-neutral-800" />
      
      <ScrollArea className="flex-grow pb-20 pt-4"> {/* pb-20 for AppBottomTabBar */}
        <div className="container mx-auto px-4 space-y-6">
          
          {/* Global Market Stats */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-neutral-300">Global Market</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GlassmorphismTradingCard padding="p-4" className="hover:border-sky-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-300">Market Cap</p>
                  <DollarSign className="h-5 w-5 text-sky-400" />
                </div>
                <AnimatedNumericDisplay value={globalMarketStats.totalMarketCap} precision={0} prefix="$" className="text-2xl font-bold text-sky-300 mt-1 block" />
              </GlassmorphismTradingCard>
              <GlassmorphismTradingCard padding="p-4" className="hover:border-purple-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-300">24h Volume</p>
                  <Activity className="h-5 w-5 text-purple-400" />
                </div>
                <AnimatedNumericDisplay value={globalMarketStats.volume24h} precision={0} prefix="$" className="text-2xl font-bold text-purple-300 mt-1 block" />
              </GlassmorphismTradingCard>
              <GlassmorphismTradingCard padding="p-4" className="hover:border-orange-500/50 transition-colors">
                 <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-300">BTC Dominance</p>
                  <Percent className="h-5 w-5 text-orange-400" />
                </div>
                <AnimatedNumericDisplay value={globalMarketStats.btcDominance} precision={1} suffix="%" className="text-2xl font-bold text-orange-300 mt-1 block" />
              </GlassmorphismTradingCard>
            </div>
          </section>

          {/* Search and Filters */}
          <section className="space-y-4 sticky top-16 bg-neutral-950 py-3 z-10 -mx-4 px-4"> {/* Sticky controls below header */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
              <Input
                type="text"
                placeholder="Search coins (e.g. Bitcoin, BTC)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <ToggleGroup 
              type="single" 
              value={activeFilter} 
              onValueChange={(value) => { if (value) setActiveFilter(value as any); }}
              className="w-full justify-start"
            >
              <ToggleGroupItem value="all" aria-label="All coins" className="data-[state=on]:bg-sky-600 data-[state=on]:text-white hover:bg-neutral-700 text-neutral-300 border-neutral-700">All</ToggleGroupItem>
              <ToggleGroupItem value="favorites" aria-label="Favorite coins" className="data-[state=on]:bg-sky-600 data-[state=on]:text-white hover:bg-neutral-700 text-neutral-300 border-neutral-700">
                <Star className="h-4 w-4 mr-2" /> Favorites
              </ToggleGroupItem>
              <ToggleGroupItem value="gainers" aria-label="Top Gainers" className="data-[state=on]:bg-green-600 data-[state=on]:text-white hover:bg-neutral-700 text-neutral-300 border-neutral-700">
                <TrendingUp className="h-4 w-4 mr-2" /> Gainers
              </ToggleGroupItem>
              <ToggleGroupItem value="losers" aria-label="Top Losers" className="data-[state=on]:bg-red-600 data-[state=on]:text-white hover:bg-neutral-700 text-neutral-300 border-neutral-700">
                <TrendingDown className="h-4 w-4 mr-2" /> Losers
              </ToggleGroupItem>
            </ToggleGroup>
          </section>

          {/* Cryptocurrency List */}
          <section>
            <div className="rounded-lg overflow-hidden border border-neutral-800">
              <Table>
                <TableHeader className="bg-neutral-800">
                  <TableRow className="border-neutral-700">
                    <TableHead className="text-neutral-400 w-10"></TableHead> {/* For Favorite Star */}
                    <TableHead className="text-neutral-400">Name</TableHead>
                    <TableHead className="text-right text-neutral-400">Price</TableHead>
                    <TableHead className="text-right text-neutral-400">24h %</TableHead>
                    <TableHead className="text-right text-neutral-400 hidden md:table-cell">Market Cap</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? filteredData.map((coin) => (
                    <TableRow 
                      key={coin.id} 
                      className="border-neutral-800 hover:bg-neutral-800/50 cursor-pointer"
                      asChild // Allow Link to wrap TableRow
                    >
                      <Link to={`/trading-interface?pair=${coin.symbol}/USDT`} className="contents"> {/* Example navigation, adjust as needed */}
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFavorite(coin.id); }} className="text-neutral-500 hover:text-yellow-400">
                            <Star className={`h-5 w-5 ${coin.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {coin.logoUrl && <img src={coin.logoUrl} alt={coin.name} className="h-7 w-7 rounded-full" />}
                            <div>
                              <div className="font-medium text-neutral-100">{coin.name}</div>
                              <div className="text-xs text-neutral-400">{coin.symbol}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <AnimatedNumericDisplay value={coin.price} precision={2} prefix="$" className="font-medium text-neutral-100" />
                        </TableCell>
                        <TableCell className={`text-right font-medium ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <AnimatedNumericDisplay value={coin.change24h} precision={2} suffix="%" />
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          <AnimatedNumericDisplay value={coin.marketCap} precision={0} prefix="$" className="text-neutral-300" />
                        </TableCell>
                      </Link>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-neutral-500 py-10">
                        No coins found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Placeholder for HeatmapVisualizationComponent */}
          <section>
             <h2 className="text-xl font-semibold mb-3 mt-6 text-neutral-300">Market Heatmap</h2>
            <Card className="bg-neutral-800/70 border-neutral-700">
              <CardHeader>
                <CardTitle className="text-neutral-200">Market Heatmap Visualization</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <p className="text-neutral-400">Heatmap visualization component would be displayed here.</p>
              </CardContent>
            </Card>
          </section>

        </div>
      </ScrollArea>
      
      <AppBottomTabBar />
    </div>
  );
};

export default MarketsPage;