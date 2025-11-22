import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Download {
  id: string;
  url: string;
  title: string;
  progress: number;
  status: 'downloading' | 'completed' | 'error';
  size: string;
  quality: string;
}

export default function Index() {
  const [url, setUrl] = useState('');
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [quality, setQuality] = useState('1080p');
  const [downloadFolder, setDownloadFolder] = useState('Downloads/Videos');
  const { toast } = useToast();

  const handleDownload = () => {
    if (!url) {
      toast({
        title: "Ошибка",
        description: "Вставьте ссылку на видео",
        variant: "destructive"
      });
      return;
    }

    const newDownload: Download = {
      id: Date.now().toString(),
      url,
      title: `Видео ${downloads.length + 1}`,
      progress: 0,
      status: 'downloading',
      size: '125 MB',
      quality
    };

    setDownloads([newDownload, ...downloads]);
    setUrl('');

    const interval = setInterval(() => {
      setDownloads(prev => prev.map(d => {
        if (d.id === newDownload.id && d.progress < 100) {
          const newProgress = d.progress + Math.random() * 15;
          if (newProgress >= 100) {
            clearInterval(interval);
            toast({
              title: "✅ Готово!",
              description: `${d.title} загружен в ${downloadFolder}`
            });
            return { ...d, progress: 100, status: 'completed' as const };
          }
          return { ...d, progress: newProgress };
        }
        return d;
      }));
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg animate-pulse-glow">
              <Icon name="Download" size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-3">
            VideoGrab
          </h1>
          <p className="text-muted-foreground text-lg">
            Загружайте видео с любых сайтов в высоком качестве
          </p>
        </header>

        <Tabs defaultValue="download" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card border border-border">
            <TabsTrigger value="download" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Download" size={18} className="mr-2" />
              Загрузка
            </TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="FileVideo" size={18} className="mr-2" />
              Файлы
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Settings" size={18} className="mr-2" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="HelpCircle" size={18} className="mr-2" />
              FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="download" className="space-y-6 animate-slide-up">
            <Card className="border-2 border-primary/20 shadow-xl bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Link" size={24} className="text-primary" />
                  Вставьте ссылку на видео
                </CardTitle>
                <CardDescription>
                  Поддерживаются все популярные платформы: YouTube, Vimeo, TikTok и другие
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
                    className="flex-1 bg-background/50 border-border focus:border-primary text-lg h-12"
                  />
                  <Button 
                    onClick={handleDownload}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-lg"
                  >
                    <Icon name="Download" size={20} className="mr-2" />
                    Скачать
                  </Button>
                </div>
                
                <div className="flex gap-4 items-center pt-2">
                  <div className="flex items-center gap-2">
                    <Icon name="Sparkles" size={16} className="text-accent" />
                    <span className="text-sm text-muted-foreground">Качество:</span>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                      {quality}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Folder" size={16} className="text-secondary" />
                    <span className="text-sm text-muted-foreground truncate max-w-xs">
                      {downloadFolder}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {downloads.length > 0 && (
              <Card className="border border-border shadow-lg animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Activity" size={24} className="text-accent" />
                    Активные загрузки
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {downloads.slice(0, 3).map((download) => (
                    <div key={download.id} className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{download.title}</p>
                            {download.status === 'completed' && (
                              <Icon name="CheckCircle2" size={18} className="text-green-500" />
                            )}
                            {download.status === 'downloading' && (
                              <div className="animate-spin">
                                <Icon name="Loader2" size={18} className="text-primary" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate max-w-md">
                            {download.url}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={download.status === 'completed' ? 'default' : 'secondary'}>
                            {download.size}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Icon name="MoreVertical" size={18} />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {download.status === 'completed' ? 'Завершено' : 'Загрузка...'}
                          </span>
                          <span className="font-medium">{Math.round(download.progress)}%</span>
                        </div>
                        <Progress value={download.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="files" className="animate-slide-up">
            <Card className="border border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="FolderOpen" size={24} className="text-primary" />
                  Загруженные файлы
                </CardTitle>
                <CardDescription>
                  Всего загружено: {downloads.filter(d => d.status === 'completed').length} файлов
                </CardDescription>
              </CardHeader>
              <CardContent>
                {downloads.filter(d => d.status === 'completed').length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Icon name="FileVideo" size={64} className="mx-auto text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground">Пока нет загруженных файлов</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {downloads.filter(d => d.status === 'completed').map((download) => (
                      <div key={download.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-all">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <Icon name="FileVideo" size={24} className="text-primary" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <p className="font-medium">{download.title}</p>
                            <p className="text-sm text-muted-foreground">{download.size} • {download.quality}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Icon name="Play" size={18} />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Icon name="FolderOpen" size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="animate-slide-up">
            <Card className="border border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Sliders" size={24} className="text-primary" />
                  Настройки загрузки
                </CardTitle>
                <CardDescription>
                  Настройте качество видео и папку для сохранения
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Icon name="Sparkles" size={18} className="text-accent" />
                    Качество видео по умолчанию
                  </label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2160p">4K (2160p)</SelectItem>
                      <SelectItem value="1440p">2K (1440p)</SelectItem>
                      <SelectItem value="1080p">Full HD (1080p)</SelectItem>
                      <SelectItem value="720p">HD (720p)</SelectItem>
                      <SelectItem value="480p">SD (480p)</SelectItem>
                      <SelectItem value="360p">Mobile (360p)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Icon name="FolderTree" size={18} className="text-secondary" />
                    Папка для загрузки
                  </label>
                  <Input
                    value={downloadFolder}
                    onChange={(e) => setDownloadFolder(e.target.value)}
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Папка будет создана автоматически, если её не существует
                  </p>
                </div>

                <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить настройки
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="animate-slide-up">
            <Card className="border border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="MessageCircleQuestion" size={24} className="text-primary" />
                  Часто задаваемые вопросы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">
                      Какие сайты поддерживаются?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      VideoGrab поддерживает более 1000 сайтов, включая YouTube, Vimeo, TikTok, Instagram, Facebook, Twitter и многие другие популярные платформы.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">
                      Где сохраняются загруженные видео?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      По умолчанию видео сохраняются в папку Downloads/Videos. Вы можете изменить путь в настройках. Папка создаётся автоматически при первой загрузке.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">
                      Какое максимальное качество доступно?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Доступны все качества от 360p до 4K (2160p), если они доступны на оригинальном видео. Система автоматически определяет лучшее качество.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left">
                      Можно ли скачать только аудио?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Да, в скором времени будет добавлена функция извлечения аудио в форматах MP3, AAC и FLAC.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left">
                      Есть ли ограничения на размер файла?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Нет жёстких ограничений. Вы можете загружать видео любого размера, если у вас достаточно места на диске.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center text-sm text-muted-foreground animate-fade-in">
          <p className="flex items-center justify-center gap-2">
            <Icon name="Shield" size={16} />
            Безопасная загрузка • Никаких вирусов • Полностью бесплатно
          </p>
        </footer>
      </div>
    </div>
  );
}
