export interface DashboardStatsResponse {
    status: "success" | "fail";
    message: string;
    data?: DashboardStats;
}

export interface DashboardStats {
    startDate: string;
    endDate: string;
    totalTickets: number;
    openedTickets: number;
    inprogressTickets: number;
    resolvedTickets: number;
    statusCompositions: StatusComposition[];
}

export interface StatusComposition {
    status: string;
    percentage: number;
    count: number;
}