package com.finverse.config;

import com.finverse.model.*;
import com.finverse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private MarketDataRepository marketDataRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private WatchlistRepository watchlistRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (assetRepository.count() > 0) {
            System.out.println("FinVerse DB already contains seeded data.");
            return;
        }

        System.out.println("Seeding FinVerse database with initial academic market dataset...");

        // 1. Create Default Users
        User demoUser = new User("Demo Investor", "user@finverse.com", passwordEncoder.encode("password123"), "ROLE_USER", "Moderate", "Medium Term (1-3 yrs)");
        User adminUser = new User("System Administrator", "admin@finverse.com", passwordEncoder.encode("password123"), "ROLE_ADMIN", "Aggressive", "Long Term (> 3 yrs)");
        userRepository.saveAll(Arrays.asList(demoUser, adminUser));

        // 2. Create Assets
        Asset nifty = new Asset("NIFTY50", "NIFTY 50 Index", "INDEX", new BigDecimal("24320.50"), new BigDecimal("145.20"), new BigDecimal("0.60"), "Index");
        Asset sensex = new Asset("SENSEX", "BSE SENSEX Index", "INDEX", new BigDecimal("79840.10"), new BigDecimal("312.80"), new BigDecimal("0.39"), "Index");
        Asset nasdaq = new Asset("NASDAQ", "NASDAQ Composite", "INDEX", new BigDecimal("17890.30"), new BigDecimal("-45.10"), new BigDecimal("-0.25"), "Index");
        Asset sp500 = new Asset("SP500", "S&P 500 Index", "INDEX", new BigDecimal("5540.20"), new BigDecimal("12.40"), new BigDecimal("0.22"), "Index");
        
        Asset reliance = new Asset("RELIANCE", "Reliance Industries Ltd.", "STOCK", new BigDecimal("2980.40"), new BigDecimal("34.50"), new BigDecimal("1.17"), "Energy & Tech");
        Asset tcs = new Asset("TCS", "Tata Consultancy Services", "STOCK", new BigDecimal("4210.00"), new BigDecimal("-18.20"), new BigDecimal("-0.43"), "Information Technology");
        Asset infy = new Asset("INFY", "Infosys Limited", "STOCK", new BigDecimal("1785.60"), new BigDecimal("22.30"), new BigDecimal("1.26"), "Information Technology");
        
        Asset aapl = new Asset("AAPL", "Apple Inc.", "STOCK", new BigDecimal("224.50"), new BigDecimal("3.10"), new BigDecimal("1.40"), "Technology");
        Asset msft = new Asset("MSFT", "Microsoft Corporation", "STOCK", new BigDecimal("448.20"), new BigDecimal("5.60"), new BigDecimal("1.27"), "Technology");
        Asset tsla = new Asset("TSLA", "Tesla Inc.", "STOCK", new BigDecimal("215.30"), new BigDecimal("-6.80"), new BigDecimal("-3.06"), "Automotive & Clean Tech");

        List<Asset> savedAssets = assetRepository.saveAll(Arrays.asList(nifty, sensex, nasdaq, sp500, reliance, tcs, infy, aapl, msft, tsla));

        // 3. Create Historical Market Data for Assets
        for (Asset asset : savedAssets) {
            BigDecimal basePrice = asset.getCurrentPrice().multiply(new BigDecimal("0.90"));
            for (int i = 60; i >= 0; i--) {
                LocalDate date = LocalDate.now().minusDays(i);
                double factor = 1.0 + (Math.sin(i * 0.15) * 0.03) + (i * 0.0015);
                BigDecimal dayClose = basePrice.multiply(new BigDecimal(factor)).setScale(2, java.math.RoundingMode.HALF_UP);
                BigDecimal dayOpen = dayClose.multiply(new BigDecimal("0.995")).setScale(2, java.math.RoundingMode.HALF_UP);
                BigDecimal dayHigh = dayClose.multiply(new BigDecimal("1.01")).setScale(2, java.math.RoundingMode.HALF_UP);
                BigDecimal dayLow = dayClose.multiply(new BigDecimal("0.99")).setScale(2, java.math.RoundingMode.HALF_UP);

                MarketData md = new MarketData(asset, date, dayOpen, dayHigh, dayLow, dayClose, 1500000L + (i * 50000L));
                marketDataRepository.save(md);
            }
        }

        // 4. Create Portfolio Items for Demo User
        Portfolio p1 = new Portfolio(demoUser, reliance, new BigDecimal("25.0"), new BigDecimal("2850.00"), LocalDate.now().minusDays(45));
        Portfolio p2 = new Portfolio(demoUser, infy, new BigDecimal("50.0"), new BigDecimal("1720.00"), LocalDate.now().minusDays(30));
        Portfolio p3 = new Portfolio(demoUser, aapl, new BigDecimal("15.0"), new BigDecimal("210.00"), LocalDate.now().minusDays(20));
        portfolioRepository.saveAll(Arrays.asList(p1, p2, p3));

        // 5. Watchlist items
        watchlistRepository.save(new Watchlist(demoUser, nifty));
        watchlistRepository.save(new Watchlist(demoUser, reliance));
        watchlistRepository.save(new Watchlist(demoUser, aapl));
        watchlistRepository.save(new Watchlist(demoUser, msft));

        // 6. Alerts
        alertRepository.save(new Alert(demoUser, reliance, "PRICE_ABOVE", new BigDecimal("3000.00"), "ACTIVE"));
        alertRepository.save(new Alert(demoUser, aapl, "PRICE_BELOW", new BigDecimal("215.00"), "ACTIVE"));

        // 7. Initial Predictions
        Prediction pred1 = new Prediction();
        pred1.setAsset(reliance);
        pred1.setUser(demoUser);
        pred1.setPredictionDate(LocalDate.now());
        pred1.setTargetDate(LocalDate.now().plusDays(7));
        pred1.setPredictedPrice(new BigDecimal("3045.20"));
        pred1.setCurrentPrice(new BigDecimal("2980.40"));
        pred1.setConfidenceScore(new BigDecimal("89.50"));
        pred1.setModelName("Random Forest Regression");
        pred1.setTrendDirection("BULLISH");
        pred1.setPredictionHorizonDays(7);
        predictionRepository.save(pred1);

        System.out.println("FinVerse database seeding completed successfully!");
    }
}
