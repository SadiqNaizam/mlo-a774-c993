import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Assuming cn utility is available

interface DynamicScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  headerActions?: React.ReactNode;
  className?: string;
  transparentMode?: boolean; // Example of adaptive prop
}

const DynamicScreenHeader: React.FC<DynamicScreenHeaderProps> = ({
  title,
  showBackButton = false,
  headerActions,
  className,
  transparentMode = false,
}) => {
  console.log('DynamicScreenHeader loaded');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full h-16 flex items-center transition-colors duration-300",
        transparentMode ? "bg-transparent text-white" : "bg-background border-b border-border text-foreground",
        className
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        <div className="flex items-center w-1/4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className={cn("mr-2", transparentMode ? "hover:bg-white/10" : "")}
              aria-label="Go back"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
        </div>
        
        <div className="flex-grow text-center w-1/2">
          <h1 className={cn(
            "text-lg font-semibold truncate",
            transparentMode ? "text-white" : "text-foreground"
          )}>
            {title}
          </h1>
        </div>

        <div className="flex items-center justify-end w-1/4">
          {headerActions}
        </div>
      </div>
      {/* This header's appearance (e.g., background, transparency) 
          can be further adapted based on screen content or scroll position 
          by managing state (e.g. scrollY) in parent components and passing props.
          The `transparentMode` prop is a basic example of this.
      */}
    </header>
  );
};

export default DynamicScreenHeader;