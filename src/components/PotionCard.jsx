import React from 'react';
import CurrencyDisplay from './CurrencyDisplay';
import { useAppData } from '../context/AppDataContext';
import RecipeViewer from './RecipeViewer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PotionCard = ({ potion }) => {
  const { calculatePotionCost, ingredients } = useAppData();
  const cost = calculatePotionCost(potion);

  return (
    <Card className="gap-0 py-5">
      <CardContent className="px-5">
        <div className="flex items-start gap-5">
          {potion.image ? (
            <img
              src={potion.image}
              alt={potion.name}
              className="size-[120px] rounded-xl border border-primary object-cover"
            />
          ) : (
            <div className="flex size-[120px] items-center justify-center rounded-xl border border-primary bg-black/20">
              <i className="bxf bx-flask-round text-5xl text-primary" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-2xl text-white">{potion.name}</h2>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {potion.category}
              </Badge>
            </div>

            <div className="mt-2.5 flex items-center gap-2.5">
              <span className="text-sm text-muted-foreground">ราคาต่อขวด:</span>
              <CurrencyDisplay price={cost} />
            </div>

            <div className="mt-4">
              <h4 className="mb-2 font-heading text-sm font-semibold tracking-wide text-gold">ส่วนผสม:</h4>
              <div className="flex flex-wrap gap-2">
                {potion.ingredients.map((item) => {
                  const ing = ingredients.find((i) => i.id === item.id);
                  return ing ? (
                    <Badge key={item.id} variant="outline" className="bg-white/10 font-normal">
                      {ing.name} x{item.quantity}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-5" />

        <h4 className="mb-2 text-primary">Brewing Steps</h4>
        <RecipeViewer steps={potion.steps} />
      </CardContent>
    </Card>
  );
};

export default PotionCard;
