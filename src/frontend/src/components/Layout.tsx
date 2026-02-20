import { ReactNode } from 'react';
import { Swords } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-accent/5">
            {/* Header */}
            <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Swords className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                                Life Leveling System
                            </h1>
                            <p className="text-xs text-muted-foreground">Level up your life, one task at a time</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-12">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-sm text-muted-foreground">
                        <p>
                            © {currentYear} Life Leveling System. Built with ❤️ using{' '}
                            <a
                                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                                    typeof window !== 'undefined' ? window.location.hostname : 'life-leveling-system'
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                caffeine.ai
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
