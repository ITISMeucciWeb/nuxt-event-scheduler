<script lang="ts" setup>
import { useGlobalStore } from "~/stores/global";
import { ArrElement } from "~/shared/types";
import { onUnmounted } from "#imports";
import {
    capitalizeEachWord,
    fromEmailToName,
    getDayAndHourFromRound
} from "~/utils";

const config = useAppConfig();
const route = useRoute();
const globalStore = useGlobalStore();

const round = computed(() => Number(route.params.round));
const eventId = computed(() => Number(route.params.id));

const roundInfo = computed(() => getDayAndHourFromRound(round.value));
const day = computed(() => {
    return config.DAYS[roundInfo.value.day];
});
const hour = computed(() => {
    return config.HOURS[roundInfo.value.hour];
});

const { data: users } = useFetch("/api/events/admin/users", {
    params: {
        eventId,
        round
    },
    watch: [eventId]
});

// Fixes for a bug where past users would be shown until the fetch is done
onUnmounted(() => {
    users.value = null;
});

const event = computed(() =>
    globalStore.events.find((event) => event.id === eventId.value)
);

if (!event.value) {
    throw new Error("No event was found");
}

function sendPresence(
    e: Event,
    user: ArrElement<NonNullable<typeof users.value>["users"]>
) {
    useFetch("/api/events/admin/updateJoined", {
        method: "POST",
        body: {
            round,
            userId: user.user.id,
            present: (e.target as HTMLInputElement).checked
        }
    });
}
</script>

<template>
    <div
        class="white-transparent-component absolute translate-x-1/2 w-[90%] right-1/2"
    >
        Sei sulla pagina di appello del corso "{{ event.name }}". <br />
        Lezione del {{ day }} alle {{ hour }}.
        <div class="flex items-start p-2 mb-1 font-black pb-0 text-xl">
            <div class="w-full text-left">Nome</div>
            <div class="flex items-center ml-auto">Presente?</div>
        </div>
        <div
            v-for="(user, index) in users?.users"
            :key="index"
            class="flex items-center p-2 mb-1"
        >
            <div class="w-full text-left">
                {{ user.user.section }}-{{ user.user.class }} |
                {{
                    capitalizeEachWord(user.user.name) ||
                    fromEmailToName(user.user.email)
                }}
            </div>
            <div class="flex items-center ml-auto">
                <input
                    :checked="Boolean(user.joinedAt)"
                    class="toggle toggle-success color-red"
                    type="checkbox"
                    @change="(e) => sendPresence(e, user)"
                />
            </div>
        </div>
    </div>
</template>
