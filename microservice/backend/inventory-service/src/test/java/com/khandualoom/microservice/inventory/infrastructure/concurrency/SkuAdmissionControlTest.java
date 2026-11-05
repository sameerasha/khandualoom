package com.khandualoom.microservice.inventory.infrastructure.concurrency;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

class SkuAdmissionControlTest {

    @Test
    @DisplayName("Should permit up to max concurrent requests and reject excess with metric increment")
    void shouldPermitUpToLimitAndRejectExcess() {
        SimpleMeterRegistry registry = new SimpleMeterRegistry();
        int maxPermits = 3;
        SkuAdmissionControl admissionControl = new SkuAdmissionControl(maxPermits, registry);

        Long skuId = 1001L;

        // Acquire all 3 permits
        assertThat(admissionControl.tryAcquire(skuId, Duration.ofMillis(100))).isTrue();
        assertThat(admissionControl.tryAcquire(skuId, Duration.ofMillis(100))).isTrue();
        assertThat(admissionControl.tryAcquire(skuId, Duration.ofMillis(100))).isTrue();

        // 4th acquisition must fail
        boolean rejected = admissionControl.tryAcquire(skuId, Duration.ofMillis(50));
        assertThat(rejected).isFalse();

        // Verify rejected counter incremented
        Counter rejectedCounter = registry.find("khandualoom.inventory.admission_control.rejected")
                .tag("productId", String.valueOf(skuId))
                .counter();
        assertThat(rejectedCounter).isNotNull();
        assertThat(rejectedCounter.count()).isEqualTo(1.0);

        // Release 1 permit and verify acquisition succeeds again
        admissionControl.release(skuId);
        assertThat(admissionControl.tryAcquire(skuId, Duration.ofMillis(100))).isTrue();
    }
}
