/* eslint-disable roblox-ts/lua-truthiness */
import { Workspace } from "@rbxts/services";
import { Character, Skill, SkillDecorator, StatusEffect } from "@rbxts/wcs";
import { Stun } from "shared/statusEffects/stun";

@SkillDecorator
export class Attack extends Skill {
	protected MutualExclusives = [Stun];
	protected OnStartServer() {
		const characterModel = this.Character.Instance as Model;
		const position = characterModel.GetPivot().Position;

		const parts = Workspace.GetPartBoundsInRadius(position, 20);
		const nearbyCharacters: Character[] = [];

		// iterate over all parts nearby and find all characters
		parts.forEach((part) => {
			const model = part.FindFirstAncestorOfClass("Model");
			const humanoid = model?.FindFirstChildOfClass("Humanoid");
			if (!humanoid || !model || model === characterModel) return;

			const character = Character.GetCharacterFromInstance(model);
			character && !nearbyCharacters.includes(character) && nearbyCharacters.push(character);
		});

		this.ApplyCooldown(5);

		if (nearbyCharacters.size() === 0) return;
		nearbyCharacters.forEach((character) => {
			// create a stun effect on the character and apply it for 2.5 seconds
			const stun = new Stun(character);
			stun.Start(2.5);
		});
	}
}
