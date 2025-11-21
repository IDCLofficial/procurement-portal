"use client"
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronDown, ChevronRight, Bug, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  selectAuthToken,
  selectAuthIsLoading,
  selectAuthIsAuthenticated,
  selectAuthIsLoggingOut,
} from '@/store/slices/authSlice';
import { selectUserData } from '@/store/slices/userSlice';
import { selectCompanyData } from '@/store/slices/companySlice';

interface SliceSectionProps {
  title: string;
  data: unknown;
  defaultOpen?: boolean;
  badge?: { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' };
}

const SliceSection: React.FC<SliceSectionProps> = ({ title, data, defaultOpen = false, badge }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between px-3 py-2 h-auto font-medium text-sm hover:bg-slate-100"
        >
          <span className="flex items-center gap-2 text-slate-700">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {title}
          </span>
          {badge && (
            <Badge variant={badge.variant} className="text-xs">
              {badge.label}
            </Badge>
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <pre className="text-xs leading-relaxed p-3 bg-slate-50 rounded-md mt-1 overflow-x-auto w-full text-slate-600 border border-slate-200">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
};

const DebugSlices: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const authToken = useSelector(selectAuthToken);
  const authIsLoading = useSelector(selectAuthIsLoading);
  const authIsAuthenticated = useSelector(selectAuthIsAuthenticated);
  const authIsLoggingOut = useSelector(selectAuthIsLoggingOut);
  const userData = useSelector(selectUserData);
  const companyData = useSelector(selectCompanyData);

  if (process.env.NEXT_PUBLIC_DEBUG_STATE !== 'true') return null;

  const authData = {
    token: authToken ? '***' : null,
    isLoading: authIsLoading,
    isAuthenticated: authIsAuthenticated,
    isLoggingOut: authIsLoggingOut,
  };

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        size="icon"
        variant="outline"
        className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full bg-white border-slate-200 hover:bg-slate-50 shadow-lg"
      >
        <Bug className="h-5 w-5 text-slate-500" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 bg-white border-slate-200 shadow-xl">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="flex items-center justify-between text-sm font-semibold text-slate-800">
          <span className="flex items-center gap-2">
            <Bug className="h-4 w-4 text-blue-500" />
            Redux Debug
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(false)}
            className="h-8 w-8 hover:bg-slate-100 rounded-full"
          >
            <X className="h-4 w-4 text-slate-400" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 pt-2">
        <ScrollArea className="h-[70vh] pr-2">
          <div className="space-y-1">
            <SliceSection
              title="Auth"
              data={authData}
              defaultOpen
              badge={{
                label: authIsAuthenticated ? 'Authenticated' : 'Not Auth',
                variant: authIsAuthenticated ? 'default' : 'secondary',
              }}
            />
            <SliceSection
              title="User"
              data={userData}
              badge={userData ? { label: 'Loaded', variant: 'default' } : undefined}
            />
            <SliceSection
              title="Company"
              data={companyData}
              badge={companyData ? { label: 'Loaded', variant: 'default' } : undefined}
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DebugSlices;