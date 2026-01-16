'use client';

import { useState, useEffect } from 'react';
import { fetchBrands } from '@/lib/api';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Box } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function BrandSelector({ selectedBrand, onSelect, className }) {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBrands() {
            try {
                const data = await fetchBrands();
                setBrands(Array.isArray(data) ? data : []);

                if (data && data.length > 0 && !selectedBrand) {
                    const westinghouse = data.find(b => b.name?.includes('Westinghouse') || b.id === 'westinghouse_in');
                    if (westinghouse) onSelect(westinghouse);
                    else if (data.length === 1) onSelect(data[0]);
                }
            } catch (e) {
                console.error("Failed to load brands", e);
            } finally {
                setLoading(false);
            }
        }
        loadBrands();
    }, [onSelect, selectedBrand]);

    const handleValueChange = (val) => {
        const brand = brands.find(b => b.id === val);
        if (brand) onSelect(brand);
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Select
                onValueChange={handleValueChange}
                value={selectedBrand?.id || ''}
                disabled={loading}
            >
                <SelectTrigger className="w-auto min-w-[180px] bg-secondary/50 border-black/10 focus:ring-0 focus:ring-offset-0 text-foreground font-medium h-9 rounded-xl transition-all hover:bg-secondary/40 text-xs px-3 shadow-sm hover:border-black hover:ring-1 hover:ring-black hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex items-center gap-2">
                        {!selectedBrand?.id && <Box size={14} className="text-muted-foreground" />}
                        <SelectValue placeholder="Select Brand..." />
                    </div>
                </SelectTrigger>
                <SelectContent
                    side="top"
                    align="start"
                    className="w-[220px] rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl shadow-xl p-1.5"
                >
                    {loading ? (
                        <SelectItem value="loading" disabled className="text-xs text-muted-foreground pl-2 py-2">Loading brands...</SelectItem>
                    ) : brands.length === 0 ? (
                        <SelectItem value="empty" disabled className="text-xs text-muted-foreground pl-2 py-2">No brands found</SelectItem>
                    ) : (
                        brands.map((brand) => (
                            <SelectItem
                                key={brand.id}
                                value={brand.id}
                                className="rounded-xl cursor-pointer py-2.5 px-3 focus:bg-secondary/50 focus:text-foreground text-foreground/80 data-[state=checked]:bg-secondary/70 data-[state=checked]:text-foreground"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-secondary/50 text-muted-foreground">
                                        <Box size={14} />
                                    </div>
                                    <span className="font-medium text-sm">{brand.name || brand.id}</span>
                                </div>
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}
