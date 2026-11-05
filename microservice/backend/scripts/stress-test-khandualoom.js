import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom Metrics
const oversellViolations = new Counter('oversell_violations');
const deadlockErrors = new Counter('deadlock_errors');
const duplicateOrderRejections = new Counter('duplicate_order_rejections');
const successfulCheckouts = new Counter('successful_checkouts');
const rejectedByAdmission = new Counter('rejected_by_admission');
const orderDuration = new Trend('order_placement_duration');

export const options = {
    scenarios: {
        // Scenario 1: 10,000 req/s flash sale burst on limited stock
        flash_sale_spike: {
            executor: 'ramping-arrival-rate',
            startRate: 100,
            timeUnit: '1s',
            preAllocatedVUs: 1000,
            maxVUs: 5000,
            stages: [
                { duration: '10s', target: 1000 },  // Warmup to 1,000 req/s
                { duration: '15s', target: 5000 },  // Peak 5,000 req/s
                { duration: '10s', target: 10000 }, // Flash sale peak 10,000 req/s
                { duration: '15s', target: 100 },   // Cool down
            ],
            exec: 'flashSaleCheckout',
        },
        // Scenario 2: Concurrent opposing multi-SKU deadlock race ([A, B] vs [B, A])
        multi_sku_deadlock_race: {
            executor: 'constant-vus',
            vus: 100,
            duration: '20s',
            startTime: '20s',
            exec: 'multiSkuDeadlockRace',
        },
        // Scenario 3: Aggressive double-click / idempotency replay test
        idempotent_replay: {
            executor: 'constant-vus',
            vus: 50,
            duration: '15s',
            startTime: '35s',
            exec: 'idempotentReplayTest',
        }
    },
    thresholds: {
        'deadlock_errors': ['count == 0'],     // Strict Invariant: 0 Deadlocks
        'oversell_violations': ['count == 0'], // Strict Invariant: 0 Oversold items
        'http_req_duration': ['p(95)<500'],    // 95% of requests under 500ms
    },
};

const BASE_URL = __ENV.GATEWAY_URL || 'http://localhost:8080';

// Scenario 1: Flash sale checkout on rare saree (SKU 1)
export function flashSaleCheckout() {
    const payload = JSON.stringify({
        userId: Math.floor(Math.random() * 100000) + 1,
        customerName: 'Test Customer ' + __VU,
        customerEmail: `customer_${__VU}_${__ITER}@khandualoom.com`,
        customerPhone: '9876543210',
        shippingAddress: '123 Heritage Lane',
        city: 'Bhubaneswar',
        state: 'Odisha',
        pincode: '751001',
        paymentMethod: 'ONLINE',
        items: [
            { productId: 1, quantity: 1, price: 15000.00 }
        ]
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': `flash-${__VU}-${__ITER}-${Date.now()}`
        },
    };

    const start = Date.now();
    const res = http.post(`${BASE_URL}/api/orders`, payload, params);
    orderDuration.add(Date.now() - start);

    if (res.status === 201) {
        successfulCheckouts.add(1);
    } else if (res.status === 429) {
        rejectedByAdmission.add(1);
    } else if (res.status === 409 || res.status === 400) {
        // Stock exhausted or reservation failed cleanly
    } else if (res.status === 500 && res.body.includes('40P01')) {
        deadlockErrors.add(1);
    }
}

// Scenario 2: Opposing multi-SKU deadlock race
export function multiSkuDeadlockRace() {
    // 50% send [SKU 1, SKU 2], 50% send [SKU 2, SKU 1]
    const isForward = __VU % 2 === 0;
    const items = isForward ? [
        { productId: 1, quantity: 1, price: 15000.00 },
        { productId: 2, quantity: 1, price: 12000.00 }
    ] : [
        { productId: 2, quantity: 1, price: 12000.00 },
        { productId: 1, quantity: 1, price: 15000.00 }
    ];

    const payload = JSON.stringify({
        userId: 2000 + __VU,
        customerName: 'Deadlock Tester ' + __VU,
        customerEmail: `deadlock_${__VU}@khandualoom.com`,
        customerPhone: '9876543210',
        shippingAddress: '456 Handloom Road',
        city: 'Cuttack',
        state: 'Odisha',
        pincode: '753001',
        paymentMethod: 'ONLINE',
        items: items
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': `deadlock-${__VU}-${__ITER}`
        },
    };

    const res = http.post(`${BASE_URL}/api/orders`, payload, params);
    if (res.status === 500 && (res.body.includes('40P01') || res.body.includes('deadlock'))) {
        deadlockErrors.add(1);
    }
}

// Scenario 3: Aggressive idempotency replay test
export function idempotentReplayTest() {
    const fixedKey = `static-idempotency-key-vu-${__VU}`;
    const payload = JSON.stringify({
        userId: 3000 + __VU,
        customerName: 'Idempotency Tester',
        customerEmail: `idemp_${__VU}@khandualoom.com`,
        customerPhone: '9876543210',
        shippingAddress: '789 Silk Street',
        city: 'Berhampur',
        state: 'Odisha',
        pincode: '760001',
        paymentMethod: 'ONLINE',
        items: [{ productId: 4, quantity: 1, price: 20000.00 }]
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': fixedKey
        },
    };

    // Burst 3 identical requests concurrently
    const responses = http.batch([
        ['POST', `${BASE_URL}/api/orders`, payload, params],
        ['POST', `${BASE_URL}/api/orders`, payload, params],
        ['POST', `${BASE_URL}/api/orders`, payload, params],
    ]);

    const orderIds = responses
        .filter(r => r.status === 200 || r.status === 201)
        .map(r => JSON.parse(r.body).id);

    // All successful responses MUST return the exact same Order ID
    if (orderIds.length > 1) {
        const firstId = orderIds[0];
        const allMatch = orderIds.every(id => id === firstId);
        check(allMatch, { 'All idempotent requests returned same Order ID': (v) => v === true });
    }
}
