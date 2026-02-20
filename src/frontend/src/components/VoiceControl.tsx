import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { Badge } from '@/components/ui/badge';

export default function VoiceControl() {
    const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceRecognition();
    const [showTranscript, setShowTranscript] = useState(false);

    if (!isSupported) {
        return null;
    }

    const handleToggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
            setShowTranscript(true);
        }
    };

    return (
        <Card className="bg-gradient-to-r from-card to-primary/5 border-primary/20">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleToggleListening}
                        size="lg"
                        className={`${
                            isListening
                                ? 'bg-destructive hover:bg-destructive/90 animate-pulse'
                                : 'bg-primary hover:bg-primary/90'
                        }`}
                    >
                        {isListening ? (
                            <>
                                <MicOff className="w-5 h-5 mr-2" />
                                Stop Listening
                            </>
                        ) : (
                            <>
                                <Mic className="w-5 h-5 mr-2" />
                                Start Voice Command
                            </>
                        )}
                    </Button>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Volume2 className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Voice Commands</span>
                            {isListening && (
                                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                                    Listening...
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Say "add task", "complete task", "add habit", or "practice skill"
                        </p>
                    </div>
                </div>

                {showTranscript && transcript && (
                    <div className="mt-4 p-3 bg-accent/30 rounded-lg border border-border/50">
                        <p className="text-sm">
                            <span className="text-muted-foreground">You said:</span>{' '}
                            <span className="font-medium">{transcript}</span>
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
