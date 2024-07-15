"use client"

import { useEffect, useState } from 'react';
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {  
  getTotalBalance, 
  getTransactions
} from '../../../../utils/api';

const chartConfig = {
  balance: {
    label: "Balance",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

interface ChartDataItem {
  month: string;
  balance: number;
}

interface Transaction {
  transaction_id: number;
  account_id: number;
  amount: number;
  category: string;
  created_at: string;
  date: string;
  description: string | null;
  type: string;
  updated_at: string;
  user_id: number;
}

interface TransactionResponse {
  userId: number;
  transactions: Transaction[];
}

export function Component({authToken}: {authToken: string}) {
  const [totalBalance, setTotalBalance] = useState(0);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // const chartData = [
  //   { month: "January", balance: totalBalance },
  //   { month: "February", balance: 305 },
  //   { month: "March", balance: 237 },
  //   { month: "April", balance: 73 },
  //   { month: "May", balance: 209 },
  //   { month: "June", balance: 214 },
  // ]

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const balance = await getTotalBalance(authToken);
  //       setTotalBalance(balance);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   }
  //   fetchData()
  // }, [authToken])
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch the current total balance
        const currentBalance = await getTotalBalance(authToken);
        
        // Fetch all transactions
        const transactionResponse: TransactionResponse = await getTransactions(authToken);
        const allTransactions = transactionResponse.transactions;
        console.log('All transactions:', allTransactions);

        // Sort transactions by date, oldest first
        allTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const data: ChartDataItem[] = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        let runningBalance = 0;
        
        // Calculate the starting balance
        const startOfYearTransactions = allTransactions.filter(t => new Date(t.date).getFullYear() < currentYear);
        const startOfYearBalance = startOfYearTransactions.reduce((sum, t) => {
          return t.type === 'income' ? sum + t.amount : sum - t.amount;
        }, 0);

        runningBalance = startOfYearBalance;

        for (let month = 0; month <= currentDate.getMonth(); month++) {
          const monthStart = new Date(currentYear, month, 1);
          const monthEnd = new Date(currentYear, month + 1, 0);
          
          // Filter transactions for this month
          const monthTransactions = allTransactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= monthStart && transactionDate <= monthEnd;
          });
          
          // Apply transactions for this month
          monthTransactions.forEach(t => {
            runningBalance = t.type === 'income' ? runningBalance + t.amount : runningBalance - t.amount;
          });
          
          // Add month's data
          data.push({
            month: monthStart.toLocaleString('default', { month: 'short' }),
            balance: Math.round(runningBalance)
          });
        }

        // Adjust the last month's balance to match the current balance
        if (data.length > 0) {
          data[data.length - 1].balance = currentBalance;
        }
        
        setChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [authToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Calculate the trend
  const latestBalance = chartData[chartData.length - 1]?.balance || 0;
  const previousBalance = chartData[chartData.length - 2]?.balance || 0;
  const trend = ((latestBalance - previousBalance) / previousBalance) * 100;
  const trendDirection = trend >= 0 ? 'up' : 'down';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Balance Chart</CardTitle>
        <CardDescription>Last 12 Months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="balance"
              type="step"
              stroke="var(--color-balance)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
