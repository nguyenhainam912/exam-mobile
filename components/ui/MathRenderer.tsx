import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { WebView } from 'react-native-webview';

interface MathRendererProps {
  content: string;
  style?: any;
  textStyle?: any;
  fontSize?: number;
  color?: string;
}

// Sử dụng function declaration thay vì arrow function để tránh lỗi export
function MathRenderer({
  content,
  style,
  textStyle,
  fontSize = 16,
  color = '#1F2937',
}: MathRendererProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Cache kiểm tra LaTeX
  const hasLatex = useMemo(() => {
    if (!content) return false;
    return content.includes('$') || content.includes('\\');
  }, [content]);

  // Nếu không có LaTeX, trả về text bình thường
  if (!hasLatex) {
    return (
      <View style={style}>
        <Text
          style={[{ fontSize, color, lineHeight: fontSize * 1.5 }, textStyle]}
        >
          {content}
        </Text>
      </View>
    );
  }

  // Cache height calculation
  const fixedHeight = useMemo(() => {
    if (!content) return 60;
    const lines = Math.max(content.split('\n').length, 1);
    const hasDisplayMath = content.includes('$$');
    const baseHeight = fontSize * 2.5;

    if (hasDisplayMath) {
      return Math.max(baseHeight * lines + 60, 100);
    }
    return Math.max(baseHeight * lines + 40, 80);
  }, [content, fontSize]);

  // Cache HTML generation
  const htmlContent = useMemo(() => {
    const escapedContent = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: ${fontSize}px;
            line-height: ${fontSize * 1.5}px;
            color: ${color};
            background: transparent;
            margin: 0;
            padding: 8px;
            word-wrap: break-word;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          body.loaded {
            opacity: 1;
          }
          .katex { 
            font-size: 1em; 
          }
          .katex-display { 
            margin: 8px 0; 
            text-align: center; 
          }
        </style>
      </head>
      <body>
        <div>${escapedContent}</div>
        <script>
          function renderAndShow() {
            try {
              renderMathInElement(document.body, {
                delimiters: [
                  {left: "$$", right: "$$", display: true},
                  {left: "$", right: "$", display: false}
                ],
                throwOnError: false,
                strict: false
              });
              
              // Hiển thị sau khi render xong
              setTimeout(() => {
                document.body.classList.add('loaded');
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage('RENDER_COMPLETE');
                }
              }, 200);
              
            } catch (error) {
              console.error('KaTeX render error:', error);
              document.body.classList.add('loaded');
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage('RENDER_COMPLETE');
              }
            }
          }
          
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', renderAndShow);
          } else {
            renderAndShow();
          }
        </script>
      </body>
      </html>
    `;
  }, [content, fontSize, color]);

  const handleMessage = (event: any) => {
    if (event.nativeEvent.data === 'RENDER_COMPLETE') {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.mathContainer, style]}>
      {isLoading && (
        <View style={[styles.loadingContainer, { height: fixedHeight }]}>
          <ActivityIndicator size="small" color="#8B5CF6" />
          <Text style={styles.loadingText}>Đang tải công thức...</Text>
        </View>
      )}
      <WebView
        source={{ html: htmlContent }}
        style={[
          styles.webView,
          {
            height: fixedHeight,
            opacity: isLoading ? 0 : 1,
          },
        ]}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        startInLoadingState={false}
        cacheEnabled={true}
        onLoadEnd={() => {
          // Fallback timeout
          setTimeout(() => setIsLoading(false), 2000);
        }}
        onError={(error) => {
          console.log('WebView error:', error);
          setIsLoading(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mathContainer: {
    backgroundColor: 'transparent',
  },
  webView: {
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    zIndex: 1,
  },
  loadingText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});

export default MathRenderer;
