import { EscapeBranch } from "@/types";

export const escapeBranches: EscapeBranch[] = [
    {
        id: "branch-1",
        brandName: "셜록홈즈",
        branchName: "강남 1호점",
        address: "서울 강남구 강남대로 123",
        lat: 37.498095,
        lng: 127.027610,
        websiteUrl: "http://sherlock-holmes.co.kr",
        themes: [
            {
                id: "theme-1-1",
                name: "빛과 그림자",
                description: "당신은 빛을 잃은 세상에서 유일한 희망입니다. 그림자 속에 숨겨진 비밀을 찾아 세상을 구하세요.",
                posterUrl: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000&auto=format&fit=crop",
                difficulty: 4,
                fear: 2,
                activity: 6,
                recommendation: 8,
                tags: ["판타지", "감성", "초보추천"]
            },
            {
                id: "theme-1-2",
                name: "지하감옥",
                description: "억울하게 누명을 쓰고 갇힌 지하감옥. 처형까지 남은 시간은 60분. 간수가 자리를 비운 사이 탈출하라!",
                posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop",
                difficulty: 7,
                fear: 5,
                activity: 3,
                recommendation: 7,
                tags: ["탈출", "스릴러"]
            }
        ]
    },
    {
        id: "branch-2",
        brandName: "키이스케이프",
        branchName: "홍대점",
        address: "서울 마포구 어울마당로 45",
        lat: 37.556289,
        lng: 126.922648,
        websiteUrl: "http://keyescape.co.kr",
        themes: [
            {
                id: "theme-2-1",
                name: "삐릿-뽀",
                description: "로봇이 지배하는 세상, 인간인 당신은 로봇인 척 연기하며 공장에 잠입해야 한다.",
                posterUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop",
                difficulty: 8,
                fear: 1,
                activity: 9,
                recommendation: 10,
                tags: ["SF", "활동성", "인생테마"]
            }
        ]
    },
    {
        id: "branch-3",
        brandName: "비트포비아",
        branchName: "강남던전",
        address: "서울 강남구 테헤란로 101",
        lat: 37.4985,
        lng: 127.0285,
        websiteUrl: "https://www.xphobia.net",
        themes: [
            {
                id: "theme-3-1",
                name: "강남목욕탕",
                description: "강남 최고의 목욕탕에서 벌어지는 미스테리한 사건. 때밀이 아저씨의 비밀을 파헤쳐라.",
                posterUrl: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                difficulty: 5,
                fear: 0,
                activity: 4,
                recommendation: 9,
                tags: ["코믹", "이색테마"]
            }
        ]
    }
];
