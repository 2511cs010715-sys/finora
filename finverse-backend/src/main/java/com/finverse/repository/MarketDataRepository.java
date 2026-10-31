package com.finverse.repository;

import com.finverse.model.MarketData;
import com.finverse.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketDataRepository extends JpaRepository<MarketData, Long> {
    List<MarketData> findByAssetOrderByTradingDateAsc(Asset asset);
    List<MarketData> findByAssetIdOrderByTradingDateAsc(Long assetId);
}
