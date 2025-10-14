import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ShoppingCart } from "lucide-react";

interface ShoppingItem {
  id: string;
  name: string;
  quantity?: string;
  purchased: boolean;
  category?: string;
}

interface ShoppingSectionProps {
  userId: string;
}

const ShoppingSection = ({ userId }: ShoppingSectionProps) => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel("shopping-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shopping_items", filter: `user_id=eq.${userId}` },
        fetchItems
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("shopping_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Erro ao carregar itens", variant: "destructive" });
      return;
    }

    setItems(data || []);
  };

  const addItem = async () => {
    if (!newItem.trim()) return;

    const { error } = await supabase.from("shopping_items").insert({
      name: newItem,
      quantity: quantity || null,
      user_id: userId,
    });

    if (error) {
      toast({ title: "Erro ao adicionar item", variant: "destructive" });
      return;
    }

    setNewItem("");
    setQuantity("");
    toast({ title: "Item adicionado!" });
  };

  const togglePurchased = async (itemId: string, purchased: boolean) => {
    const { error } = await supabase
      .from("shopping_items")
      .update({ purchased: !purchased })
      .eq("id", itemId);

    if (error) {
      toast({ title: "Erro ao atualizar item", variant: "destructive" });
    }
  };

  const deleteItem = async (itemId: string) => {
    const { error } = await supabase.from("shopping_items").delete().eq("id", itemId);

    if (error) {
      toast({ title: "Erro ao excluir item", variant: "destructive" });
    } else {
      toast({ title: "Item excluído!" });
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-secondary" />
          Lista de Compras
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Novo item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addItem()}
            className="flex-1"
          />
          <Input
            placeholder="Qtd"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addItem()}
            className="w-24"
          />
          <Button onClick={addItem} size="icon" className="bg-secondary hover:bg-secondary/90">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Lista vazia. Adicione itens acima!
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={item.purchased}
                  onCheckedChange={() => togglePurchased(item.id, item.purchased)}
                />
                <div className="flex-1">
                  <p className={`font-medium ${item.purchased ? "line-through text-muted-foreground" : ""}`}>
                    {item.name}
                  </p>
                  {item.quantity && (
                    <p className="text-sm text-muted-foreground">{item.quantity}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteItem(item.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShoppingSection;