import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import CurrencyDisplay from './CurrencyDisplay';
import NumberSliderInput, { parseNumber } from './NumberSliderInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const CartPlanner = ({ selectedPotionId }) => {
  const { potions, ingredients, toTotalKnuts, toCurrencyObj } = useAppData();
  const [quantity, setQuantity] = useState('');

  const selectedPotion = potions.find((p) => p.id === selectedPotionId);
  const qty = parseNumber(quantity, 0);

  let totalKnuts = 0;
  if (selectedPotion && qty > 0) {
    selectedPotion.ingredients.forEach((ingItem) => {
      const ing = ingredients.find((i) => i.id === ingItem.id);
      if (ing) {
        totalKnuts += toTotalKnuts(ing.price) * (ingItem.quantity * qty);
      }
    });
  }
  const totalCost = toCurrencyObj(totalKnuts);

  return (
    <Card className="h-full gap-4 py-6">
      <CardHeader className="px-6 pb-0">
        <CardTitle className="flex items-center gap-2.5 font-heading text-xl text-white">
          <i className="bx bx-cart-alt text-primary" /> Craft Planner
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6">
        {!selectedPotion ? (
          <p className="rounded-lg border border-dashed border-border bg-white/[0.03] p-4 text-center text-sm text-muted-foreground">
            เลือกสูตรยาด้านบนเพื่อเริ่มวางแผนคราฟ
          </p>
        ) : (
          <>
            <Badge
              variant="outline"
              className="mb-5 gap-2 border-gold/25 bg-primary/12 px-3.5 py-2 text-sm font-semibold text-gold"
            >
              <i className="bxf bx-flask-round" />
              {selectedPotion.name}
            </Badge>

            <div className="mb-4 space-y-2">
              <Label>จำนวนขวดที่ต้องการคราฟ</Label>
              <NumberSliderInput
                value={quantity}
                onChange={setQuantity}
                min={0}
                placeholder="กรอกจำนวน"
              />
            </div>

            {qty > 0 ? (
              <div>
                <h4 className="mb-3 font-heading text-sm font-semibold tracking-wide text-gold">
                  วัตถุดิบทั้งหมดที่ต้องใช้
                </h4>
                <ul className="space-y-2">
                  {selectedPotion.ingredients.map((ingItem) => {
                    const ing = ingredients.find((i) => i.id === ingItem.id);
                    const totalRequired = ingItem.quantity * qty;
                    return (
                      <li
                        key={ingItem.id}
                        className="flex items-center justify-between rounded-lg bg-white/5 px-3.5 py-3"
                      >
                        <span>{ing?.name}</span>
                        <span className="font-bold text-gold">x{totalRequired}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 flex items-center justify-between rounded-lg bg-black/25 p-4 font-bold">
                  <span>ราคารวม:</span>
                  <CurrencyDisplay price={totalCost} />
                </div>
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-border bg-white/[0.03] p-4 text-center text-sm text-muted-foreground">
                กรอกจำนวนขวดเพื่อดูวัตถุดิบ
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CartPlanner;
