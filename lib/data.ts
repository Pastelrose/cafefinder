import { Cafe } from "@/types";

export const cafes: Cafe[] = [
    {
        id: "1",
        name: "Vintage Garden",
        description: "도심 속에서 즐기는 앤틱한 분위기의 정원 카페입니다. 100년 된 고택을 개조하여 만든 공간으로, 사계절 내내 아름다운 정원 뷰를 감상할 수 있습니다. 조용한 클래식 음악과 함께 갓 구운 스콘과 홍차를 즐기며 바쁜 일상 속에서 잠시 쉬어가세요.",
        address: "서울 중구 세종대로 110",
        lat: 37.5665,
        lng: 126.978,
        images: [
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop",
        ],
        tags: ["앤틱", "정원", "조용함", "디저트맛집"],
        rating: 4.5,
        websiteUrl: "https://example.com/vintage",
    },
    {
        id: "2",
        name: "Modern Brew",
        description: "미니멀한 인테리어와 직접 로스팅한 스페셜티 커피를 제공합니다. 매일 아침 큐그레이더가 엄선한 원두로 내리는 드립 커피의 향을 느껴보세요. 넓은 테이블과 콘센트가 구비되어 있어 노트북 작업이나 독서를 하기에도 최적의 장소입니다.",
        address: "서울 중구 을지로 30",
        lat: 37.5651,
        lng: 126.989553,
        images: [
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop",
        ],
        tags: ["모던", "스페셜티", "노트북하기좋은", "채광좋은"],
        rating: 4.8,
        websiteUrl: "https://example.com/modern",
    },
    {
        id: "3",
        name: "Book & Tea",
        description: "책 냄새 가득한 공간에서 다양한 차를 즐길 수 있는 북카페입니다. 5,000권 이상의 장서를 보유하고 있으며, 매달 새로운 큐레이션으로 독서의 즐거움을 더해드립니다. 향긋한 허브티와 함께 나만의 사색에 잠겨보세요.",
        address: "서울 중구 퇴계로 100",
        lat: 37.561,
        lng: 126.994,
        images: [
            "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1000&auto=format&fit=crop",
        ],
        tags: ["북카페", "차", "조용함", "혼자가기좋은"],
        rating: 4.2,
        websiteUrl: "https://example.com/booktea",
    },
    {
        id: "4",
        name: "Urban Oasis",
        description: "삭막한 도시 뷰를 즐기며 마시는 시원한 커피 한 잔. 루프탑에서 바라보는 서울의 야경은 그야말로 장관입니다. 낮에는 따스한 햇살을, 밤에는 화려한 불빛을 즐길 수 있는 도심 속 오아시스 같은 공간입니다.",
        address: "서울 종로구 종로 50",
        lat: 37.570,
        lng: 126.982,
        images: [
            "https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=1000&auto=format&fit=crop",
        ],
        tags: ["뷰맛집", "테라스", "데이트", "힙한"],
        rating: 4.6,
        websiteUrl: "https://example.com/oasis",
    },
    {
        id: "5",
        name: "Retro Vibe",
        description: "80년대 감성을 그대로 재현한 레트로 컨셉 카페. 자개장, 옛날 TV, LP판 등 추억의 소품들로 가득 차 있어 사진 찍기에 좋습니다. 달달한 다방 커피와 옛날 팥빙수를 맛보며 시간 여행을 떠나보세요.",
        address: "서울 중구 명동길 20",
        lat: 37.563,
        lng: 126.985,
        images: [
            "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000&auto=format&fit=crop",
        ],
        tags: ["레트로", "사진찍기좋은", "음악감상", "이색데이트"],
        rating: 4.3,
        websiteUrl: "https://example.com/retro",
    },
];
