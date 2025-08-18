import UIKit
import Capacitor
import WebKit

class CAPBridgeViewController: CAPBridgeViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Configure WebView for better mobile experience
        if let webView = self.webView {
            webView.scrollView.bounces = true
            webView.scrollView.alwaysBounceVertical = true
            webView.allowsBackForwardNavigationGestures = true
            webView.configuration.allowsInlineMediaPlayback = true
            webView.configuration.mediaTypesRequiringUserActionForPlayback = []
            
            // Inject mobile-optimized CSS
            let mobileCSS = """
                var style = document.createElement('style');
                style.innerHTML = `
                    * { -webkit-touch-callout: none; -webkit-user-select: none; }
                    input, textarea { -webkit-user-select: text; }
                    body { -webkit-text-size-adjust: 100%; }
                `;
                document.head.appendChild(style);
            """
            
            let script = WKUserScript(source: mobileCSS, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
            webView.configuration.userContentController.addUserScript(script)
        }
    }
    
    override func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }
        
        let urlString = url.absoluteString.lowercased()
        
        // Handle special schemes
        if url.scheme == "tel" || url.scheme == "mailto" || url.scheme == "whatsapp" {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
            decisionHandler(.cancel)
            return
        }
        
        // Allow main domain and subdomains
        if url.host?.contains("locompro.com.ar") == true || url.host?.contains("lovableproject.com") == true {
            decisionHandler(.allow)
            return
        }
        
        // Check if it's an external link that should open in Safari
        if navigationAction.navigationType == .linkActivated {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
            decisionHandler(.cancel)
            return
        }
        
        decisionHandler(.allow)
    }
    
    override func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        showLoadingView()
    }
    
    override func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        hideLoadingView()
    }
    
    override func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        hideLoadingView()
        showErrorView()
    }
    
    private var loadingView: UIView?
    private var errorView: UIView?
    
    private func showLoadingView() {
        hideErrorView()
        
        if loadingView != nil { return }
        
        loadingView = UIView(frame: view.bounds)
        loadingView?.backgroundColor = UIColor.white
        
        let spinner = UIActivityIndicatorView(style: .large)
        spinner.color = UIColor(red: 0.0, green: 0.4, blue: 0.8, alpha: 1.0)
        spinner.translatesAutoresizingMaskIntoConstraints = false
        spinner.startAnimating()
        
        let label = UILabel()
        label.text = "Cargando…"
        label.textAlignment = .center
        label.font = UIFont.systemFont(ofSize: 18, weight: .medium)
        label.textColor = UIColor.darkGray
        label.translatesAutoresizingMaskIntoConstraints = false
        
        loadingView?.addSubview(spinner)
        loadingView?.addSubview(label)
        view.addSubview(loadingView!)
        
        NSLayoutConstraint.activate([
            spinner.centerXAnchor.constraint(equalTo: loadingView!.centerXAnchor),
            spinner.centerYAnchor.constraint(equalTo: loadingView!.centerYAnchor, constant: -20),
            label.centerXAnchor.constraint(equalTo: loadingView!.centerXAnchor),
            label.topAnchor.constraint(equalTo: spinner.bottomAnchor, constant: 20)
        ])
    }
    
    private func hideLoadingView() {
        loadingView?.removeFromSuperview()
        loadingView = nil
    }
    
    private func showErrorView() {
        hideLoadingView()
        
        if errorView != nil { return }
        
        errorView = UIView(frame: view.bounds)
        errorView?.backgroundColor = UIColor.white
        
        let imageView = UIImageView()
        imageView.image = UIImage(systemName: "wifi.slash")
        imageView.tintColor = UIColor.lightGray
        imageView.translatesAutoresizingMaskIntoConstraints = false
        
        let titleLabel = UILabel()
        titleLabel.text = "Sin conexión a internet"
        titleLabel.textAlignment = .center
        titleLabel.font = UIFont.systemFont(ofSize: 20, weight: .semibold)
        titleLabel.textColor = UIColor.darkGray
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let messageLabel = UILabel()
        messageLabel.text = "Por favor, revisá tu conexión e intentá nuevamente."
        messageLabel.textAlignment = .center
        messageLabel.font = UIFont.systemFont(ofSize: 16)
        messageLabel.textColor = UIColor.gray
        messageLabel.numberOfLines = 0
        messageLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let retryButton = UIButton(type: .system)
        retryButton.setTitle("Reintentar", for: .normal)
        retryButton.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .medium)
        retryButton.setTitleColor(UIColor.white, for: .normal)
        retryButton.backgroundColor = UIColor(red: 0.0, green: 0.4, blue: 0.8, alpha: 1.0)
        retryButton.layer.cornerRadius = 8
        retryButton.translatesAutoresizingMaskIntoConstraints = false
        retryButton.addTarget(self, action: #selector(retryConnection), for: .touchUpInside)
        
        errorView?.addSubview(imageView)
        errorView?.addSubview(titleLabel)
        errorView?.addSubview(messageLabel)
        errorView?.addSubview(retryButton)
        view.addSubview(errorView!)
        
        NSLayoutConstraint.activate([
            imageView.centerXAnchor.constraint(equalTo: errorView!.centerXAnchor),
            imageView.centerYAnchor.constraint(equalTo: errorView!.centerYAnchor, constant: -80),
            imageView.widthAnchor.constraint(equalToConstant: 60),
            imageView.heightAnchor.constraint(equalToConstant: 60),
            
            titleLabel.centerXAnchor.constraint(equalTo: errorView!.centerXAnchor),
            titleLabel.topAnchor.constraint(equalTo: imageView.bottomAnchor, constant: 20),
            titleLabel.leadingAnchor.constraint(equalTo: errorView!.leadingAnchor, constant: 40),
            titleLabel.trailingAnchor.constraint(equalTo: errorView!.trailingAnchor, constant: -40),
            
            messageLabel.centerXAnchor.constraint(equalTo: errorView!.centerXAnchor),
            messageLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 15),
            messageLabel.leadingAnchor.constraint(equalTo: errorView!.leadingAnchor, constant: 40),
            messageLabel.trailingAnchor.constraint(equalTo: errorView!.trailingAnchor, constant: -40),
            
            retryButton.centerXAnchor.constraint(equalTo: errorView!.centerXAnchor),
            retryButton.topAnchor.constraint(equalTo: messageLabel.bottomAnchor, constant: 30),
            retryButton.widthAnchor.constraint(equalToConstant: 120),
            retryButton.heightAnchor.constraint(equalToConstant: 44)
        ])
    }
    
    private func hideErrorView() {
        errorView?.removeFromSuperview()
        errorView = nil
    }
    
    @objc private func retryConnection() {
        hideErrorView()
        showLoadingView()
        webView?.reload()
    }
}