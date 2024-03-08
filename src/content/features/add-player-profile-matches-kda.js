import React from 'dom-chef'
import select from 'select-dom'

import {
    hasFeatureAttribute,
    setFeatureAttribute,
} from '../helpers/dom-element'
import { getPlayer, getPlayerMatches } from '../helpers/faceit-api'
import {
    getPlayerProfileNickname,
    getPlayerProfileStatsGame,
} from '../helpers/player-profile'

const FEATURE_ATTRIBUTE = 'matches-kda'

export default async (statsContentElement) => {
    const matchElements = select.all('table > tbody > tr', statsContentElement)

    const matchElementsHead = matchElements.shift()

    if (
        matchElements.length === 0 ||
        !matchElementsHead ||
        hasFeatureAttribute(FEATURE_ATTRIBUTE, statsContentElement)
    ) {
        return
    }

    setFeatureAttribute(FEATURE_ATTRIBUTE, statsContentElement)

    matchElementsHead.children[matchElementsHead.children.length - 2].insertAdjacentElement('beforebegin', (
        <th
            style={{
                color: '#8c8c8c',
                padding: 8,
                marginBottom: 8,
                textAlign: 'left',
                width: 160,
            }}
        >
            KDA
        </th>
    ));

    const nickname = getPlayerProfileNickname()
    const player = await getPlayer(nickname)
    const game = getPlayerProfileStatsGame()
    const matches = await getPlayerMatches(player.id, game, 30)

    matchElements.forEach(async (matchElement, index) => {
        const matchId = matches[index].matchId

        if (!matchId) {
            return
        }

        const match = matches[index]
        
        console.log(match)

        const kdaElement = (
            <td
                style={{
                    borderTop: '1px solid #676767',
                    padding: 8,
                }}
            >
                <span
                    style={{
                        color: '#fff',
                        fontWeight: 'normal',
                        textTransform: 'none',
                    }}>
                    {match.i6 ? `${match.i6}` : ''}
                    /
                    {match.i8 ? `${match.i8}` : ''}
                    /
                    {match.i7 ? `${match.i7}` : ''}
                </span>
            </td>
        );

        matchElement.children[
            matchElement.children.length - 3
        ].insertAdjacentElement('beforebegin', kdaElement)
    })
}