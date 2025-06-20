import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { GripVertical } from 'lucide-react';

interface ModularDashboardWidgetProps {
  widgetId: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  // headerActions?: React.ReactNode; // Example for future enhancement: actions in header
}

const ModularDashboardWidget: React.FC<ModularDashboardWidgetProps> = ({
  widgetId,
  title,
  description,
  children,
  className = '',
  // headerActions,
}) => {
  console.log(`ModularDashboardWidget loaded: ${widgetId} - ${title || 'No Title'}`);

  return (
    <Card className={`w-full h-full flex flex-col bg-card/80 backdrop-blur-sm border-border/50 ${className}`}>
      {(title || description) && (
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 pt-4 px-4">
          <div className="flex-grow">
            {title && <CardTitle className="text-base font-medium text-foreground">{title}</CardTitle>}
            {description && <CardDescription className="text-xs text-muted-foreground mt-1">{description}</CardDescription>}
          </div>
          {/* 
            The GripVertical icon hints at draggability, which would be implemented 
            by a parent component managing the dashboard layout.
          */}
          <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab flex-shrink-0 ml-2" aria-label="Drag to rearrange widget" />
          {/* {headerActions && <div className="ml-auto">{headerActions}</div>} */}
        </CardHeader>
      )}
      <CardContent className="flex-grow p-4 pt-0 flex">
        {children ? (
          <div className="w-full h-full">
            {children}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-sm text-muted-foreground">Widget content not available.</p>
          </div>
        )}
      </CardContent>
      {/* A CardFooter could be added if widgets commonly share footer actions */}
      {/* e.g., <CardFooter className="p-2 border-t"><p>Footer</p></CardFooter> */}
    </Card>
  );
};

export default ModularDashboardWidget;