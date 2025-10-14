import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ListTodo, ShoppingCart, Calendar } from "lucide-react";

interface DashboardSummaryProps {
  userId: string;
}

const DashboardSummary = ({ userId }: DashboardSummaryProps) => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    shoppingItems: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: tasks } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId);

      const { data: shopping } = await supabase
        .from("shopping_items")
        .select("*")
        .eq("user_id", userId)
        .eq("purchased", false);

      const total = tasks?.length || 0;
      const completed = tasks?.filter((t) => t.completed).length || 0;

      setStats({
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: total - completed,
        shoppingItems: shopping?.length || 0,
      });
    };

    fetchStats();

    const channel = supabase
      .channel("dashboard-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        fetchStats
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shopping_items" },
        fetchStats
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const summaryCards = [
    {
      title: "Tarefas Totais",
      value: stats.totalTasks,
      icon: ListTodo,
      color: "from-primary to-accent",
    },
    {
      title: "Concluídas",
      value: stats.completedTasks,
      icon: CheckCircle2,
      color: "from-secondary to-accent",
    },
    {
      title: "Pendentes",
      value: stats.pendingTasks,
      icon: Calendar,
      color: "from-accent to-primary",
    },
    {
      title: "Lista de Compras",
      value: stats.shoppingItems,
      icon: ShoppingCart,
      color: "from-secondary to-primary",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardSummary;