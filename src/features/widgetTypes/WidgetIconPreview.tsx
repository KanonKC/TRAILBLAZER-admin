// Mirrors TRAILBLAZER-frontend/app/dashboard/widgets/_components/WidgetCard.tsx's icon
// container exactly (p-3 rounded-xl, 24x24 icon, `${theme_color}1a` tinted background) so
// admins see the same size/ratio the Widget Gallery will actually render.
export function WidgetIconPreview({ src, themeColor }: { src: string | null; themeColor: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1.5">
                <div className="p-3 rounded-xl border">
                    <WidgetIconImage src={src} />
                </div>
                <span className="text-xs text-muted-foreground">Framed</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
                <div
                    className="p-3 rounded-xl"
                    style={themeColor ? { backgroundColor: `${themeColor}1a`, color: themeColor } : undefined}
                >
                    <WidgetIconImage src={src} />
                </div>
                <span className="text-xs text-muted-foreground">On theme color</span>
            </div>
        </div>
    );
}

function WidgetIconImage({ src }: { src: string | null }) {
    if (!src) {
        return <div className="w-6 h-6" />;
    }
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="w-6 h-6" />
    );
}
