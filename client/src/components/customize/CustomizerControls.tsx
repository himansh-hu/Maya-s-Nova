import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Palette, Scale, Type } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  model: string;
  price: number;
}

interface CustomizationOptions {
  model: string;
  material: string;
  color: string;
  scale: number;
  text: string;
}

interface CustomizerControlsProps {
  customization: CustomizationOptions;
  models: Model[];
  onCustomizationChange: (key: keyof CustomizationOptions, value: any) => void;
  onModelChange: (modelId: string) => void;
}

export default function CustomizerControls({
  customization,
  models,
  onCustomizationChange,
  onModelChange
}: CustomizerControlsProps) {
  const [activeModelId, setActiveModelId] = useState<string>(
    models.find(m => m.model === customization.model)?.id || models[0].id
  );

  const handleModelSelect = (id: string) => {
    setActiveModelId(id);
    onModelChange(id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Select Base Model</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {models.map((model) => (
              <div 
                key={model.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  activeModelId === model.id 
                    ? 'border-primary bg-primary/10' 
                    : 'hover:border-muted-foreground'
                }`}
                onClick={() => handleModelSelect(model.id)}
              >
                <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center text-muted-foreground text-sm">
                  Model Preview
                </div>
                <p className="font-medium">{model.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <Badge variant="outline">${model.price.toFixed(2)}</Badge>
                  {activeModelId === model.id && (
                    <Badge variant="secondary">Selected</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Material & Color</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <select 
                id="material" 
                className="w-full rounded-md border border-input bg-transparent p-2"
                value={customization.material}
                onChange={(e) => onCustomizationChange('material', e.target.value)}
              >
                <option value="PLA">PLA Standard (Lightweight)</option>
                <option value="ABS">ABS (Durable)</option>
                <option value="PETG">PETG (Flexible)</option>
                <option value="Resin">High-Detail Resin</option>
              </select>
              <p className="text-xs text-muted-foreground">
                {customization.material === 'PLA' && 'Economical and environmentally friendly. Good for decorative items.'}
                {customization.material === 'ABS' && 'Durable and impact-resistant. Great for functional parts.'}
                {customization.material === 'PETG' && 'Flexible with good chemical resistance. Ideal for mechanical parts.'}
                {customization.material === 'Resin' && 'Premium material with fine details. Best for intricate designs.'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="grid grid-cols-6 gap-2 mb-2">
                {['#6D28D9', '#EA580C', '#16A34A', '#0891B2', '#000000', '#FFFFFF'].map((color) => (
                  <div 
                    key={color}
                    className={`h-8 rounded-md cursor-pointer border-2 ${
                      customization.color === color ? 'border-ring' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => onCustomizationChange('color', color)}
                  />
                ))}
              </div>
              <Input 
                id="color" 
                type="color" 
                value={customization.color}
                onChange={(e) => onCustomizationChange('color', e.target.value)}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Scale</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="scale">Size Adjustment</Label>
                <span className="text-sm font-medium">{customization.scale}x</span>
              </div>
              <Slider 
                id="scale"
                min={0.5}
                max={2}
                step={0.1}
                value={[customization.scale]}
                onValueChange={(value) => onCustomizationChange('scale', value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Smaller (0.5x)</span>
                <span>Original (1x)</span>
                <span>Larger (2x)</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Type className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Customization</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="text">Text Engraving (Optional)</Label>
              <Input 
                id="text" 
                placeholder="Enter text to engrave..."
                value={customization.text}
                onChange={(e) => onCustomizationChange('text', e.target.value)}
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground">
                Maximum 30 characters. Adds $5 to the total price.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}