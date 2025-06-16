import { useDonationDonatur } from "@/hooks/donation/use-donation";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Calendar, MessageCircle } from "lucide-react";

interface Donatur {
  id: string;
  name: string;
  amount: string;
  program_donation?: string; // Made optional
  message?: string; // Made optional
  date: string;
  status: string;
}

// Utility function untuk mendapatkan inisial dari nama
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Utility function untuk format currency
const formatCurrency = (amount: string): string => {
  const numAmount = parseFloat(amount);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

// Utility function untuk format tanggal
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

// Component untuk item donatur individual
const DonaturItem = ({ donatur, index }: { donatur: Donatur; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="mb-4 last:mb-0"
    >
      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <Avatar className="h-12 w-12 border-2 border-green-100">
          <AvatarFallback className="bg-green-500 text-white font-semibold text-sm">
            {getInitials(donatur.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 truncate">
              {donatur.name}
            </h4>
            <Badge 
              variant={donatur.status === 'settlement' ? 'default' : 'secondary'}
              className="ml-2 text-xs"
            >
              {donatur.status === 'settlement' ? 'Berhasil' : donatur.status}
            </Badge>
          </div>
          
          <p className="text-lg font-bold text-green-600 mb-1">
            {formatCurrency(donatur.amount)}
          </p>
          
          {donatur.program_donation && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {donatur.program_donation}
            </p>
          )}
          
          {donatur.message && (
            <div className="flex items-start space-x-1 mb-2">
              <MessageCircle className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500 italic line-clamp-2">
                "{donatur.message}"
              </p>
            </div>
          )}
          
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(donatur.date)}</span>
          </div>
        </div>
      </div>
      <Separator className="mt-3" />
    </motion.div>
  );
};

export default function DashboardDonatur() {
  const { data: donaturs, isLoading } = useDonationDonatur();
  
  const hasDonaturs = donaturs?.data && donaturs?.data?.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full   max-w-md"
    >
      <Card className="shadow-xl border-0 bg-gradient-to-br h-full from-white to-gray-50">
        <CardHeader className="pb-3">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between"
          >
            <div className="flex w-full items-center justify-center space-x-2">
              <div className="p-2 bg-green-100 rounded-full">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Donatur
                </CardTitle>
              </div>
            </div>
            
          </motion.div>
        </CardHeader>
        
        <CardContent className="pt-0 h-full">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3">
                  <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : hasDonaturs ? (
            <ScrollArea className="h-130 pr-4">
              <div className="space-y-0">
                {donaturs.data.map((donatur, index) => (
                  <DonaturItem 
                    key={donatur.id} 
                    donatur={donatur} 
                    index={index}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-8"
            >
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Belum Ada Donatur
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Donasi pertama akan muncul di sini setelah ada yang berdonasi
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}