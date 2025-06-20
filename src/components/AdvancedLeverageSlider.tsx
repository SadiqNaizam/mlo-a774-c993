import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { TriangleAlert } from 'lucide-react';

interface AdvancedLeverageSliderProps {
  id?: string;
  currentLeverage: number;
  onLeverageChange: (leverage: number) => void;
  minLeverage?: number;
  maxLeverage?: number;
  step?: number;
  notionalTradeValue: number; // The total value of the trade the user wants to open (e.g., 10,000 USD)
  assetSymbol?: string; // e.g., "USDT" for margin currency display
  className?: string;
}

type RiskLevel = 'low' | 'medium' | 'high' | 'extreme';

const AdvancedLeverageSlider: React.FC<AdvancedLeverageSliderProps> = ({
  id,
  currentLeverage,
  onLeverageChange,
  minLeverage = 1,
  maxLeverage = 100,
  step = 1,
  notionalTradeValue,
  assetSymbol = "USDT",
  className,
}) => {
  console.log('AdvancedLeverageSlider loaded');

  const handleSliderChange = (value: number[]) => {
    onLeverageChange(value[0]);
  };

  const marginRequired = currentLeverage > 0 ? notionalTradeValue / currentLeverage : 0;

  const getRiskProfile = (leverage: number): { level: RiskLevel; title: string; description: string; variant: 'default' | 'destructive' | null } => {
    if (leverage <= 10) {
      return {
        level: 'low',
        title: 'Low Risk',
        description: `Leverage at ${leverage}x. Prudent leverage can enhance capital efficiency. Always manage your risk.`,
        variant: null, // No Alert, or a very mild one
      };
    }
    if (leverage <= 25) {
      return {
        level: 'medium',
        title: 'Moderate Risk',
        description: `Leverage of ${leverage}x magnifies both potential gains and losses. Ensure proper risk management.`,
        variant: 'default',
      };
    }
    if (leverage <= 75) {
      return {
        level: 'high',
        title: 'High Risk',
        description: `At ${leverage}x leverage, market volatility can significantly impact your margin. Risk of liquidation is substantial.`,
        variant: 'destructive',
      };
    }
    return {
      level: 'extreme',
      title: 'Extreme Risk - Liquidation Danger!',
      description: `Trading with ${leverage}x leverage is highly speculative and carries an extreme risk of rapid liquidation with minor price fluctuations. Proceed with utmost caution.`,
      variant: 'destructive',
    };
  };

  const riskProfile = getRiskProfile(currentLeverage);

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor={id || 'leverage-slider'} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Leverage
          </label>
          <Badge variant="outline" className="text-base font-semibold">
            {currentLeverage.toFixed(currentLeverage % 1 === 0 ? 0 : 1)}x
          </Badge>
        </div>
        <Slider
          id={id || 'leverage-slider'}
          min={minLeverage}
          max={maxLeverage}
          step={step}
          value={[currentLeverage]}
          onValueChange={handleSliderChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
          <span>{minLeverage}x</span>
          <span>{maxLeverage}x</span>
        </div>
      </div>

      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300">Estimated Margin Required:</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {marginRequired.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {assetSymbol}
        </p>
        {notionalTradeValue > 0 && currentLeverage > 0 && (
           <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            For a position size of {notionalTradeValue.toLocaleString()} {assetSymbol}.
          </p>
        )}
      </div>

      {riskProfile.variant ? (
        <Alert variant={riskProfile.variant}>
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>{riskProfile.title}</AlertTitle>
          <AlertDescription>{riskProfile.description}</AlertDescription>
        </Alert>
      ) : (
        <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-md">
            <div className="flex items-center">
                 {/* <Info className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" /> Can add an icon here */}
                <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">{riskProfile.title}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">{riskProfile.description}</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedLeverageSlider;