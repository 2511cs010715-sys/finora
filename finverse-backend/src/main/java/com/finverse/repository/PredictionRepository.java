package com.finverse.repository;

import com.finverse.model.Prediction;
import com.finverse.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByAssetOrderByCreatedAtDesc(Asset asset);
    List<Prediction> findByUserIdOrderByCreatedAtDesc(Long userId);
}
