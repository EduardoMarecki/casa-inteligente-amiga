import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Calendar, ShoppingCart, MessageCircle, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg">
              <Home className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Assistente Virtual
            </span>
            <br />
            de Vida Doméstica
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Organize sua casa, gerencie tarefas e simplifique o dia a dia com ajuda de IA
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Começar Agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="border-2 px-8 py-6 text-lg hover:bg-muted"
            >
              Já tenho conta
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Calendar,
              title: "Tarefas Domésticas",
              description: "Organize e acompanhe todas as atividades da casa",
              color: "from-primary to-accent",
            },
            {
              icon: ShoppingCart,
              title: "Lista de Compras",
              description: "Nunca mais esqueça itens importantes",
              color: "from-secondary to-accent",
            },
            {
              icon: MessageCircle,
              title: "Chat com IA",
              description: "Receba sugestões inteligentes para sua rotina",
              color: "from-accent to-primary",
            },
            {
              icon: Sparkles,
              title: "Lembretes Smart",
              description: "Notificações no momento certo",
              color: "from-secondary to-primary",
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para organizar sua vida?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Junte-se a milhares de famílias que já simplificaram sua rotina
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            variant="secondary"
            className="px-8 py-6 text-lg shadow-lg"
          >
            Criar Conta Grátis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
